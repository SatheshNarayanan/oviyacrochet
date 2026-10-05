import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Unsplash crochet placeholder images (legally free)
const PLACEHOLDER_IMAGES = {
  amigurumi: [
    "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=800&q=80",
    "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&q=80",
    "https://images.unsplash.com/photo-1584553421349-3557471bed79?w=800&q=80",
  ],
  bags: [
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
  ],
  home: [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80",
  ],
  baby: [
    "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80",
    "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&q=80",
    "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80",
  ],
  accessories: [
    "https://images.unsplash.com/photo-1523380744952-b8fafc95a310?w=800&q=80",
    "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80",
    "https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=800&q=80",
  ],
  gifts: [
    "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80",
    "https://images.unsplash.com/photo-1575384043001-033ffe885031?w=800&q=80",
    "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&q=80",
  ],
};

function makeImages(arr: string[], name: string) {
  return arr.map((url, i) => ({
    url,
    alt: `${name} — view ${i + 1}`,
    position: i,
    isPrimary: i === 0,
  }));
}

async function main() {
  console.log("🌱 Seeding Oviya's Crochet database...");

  // ─── Categories ───────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "amigurumi" },
      create: { name: "Amigurumi", slug: "amigurumi" },
      update: {},
    }),
    prisma.category.upsert({
      where: { slug: "bags" },
      create: { name: "Bags", slug: "bags" },
      update: {},
    }),
    prisma.category.upsert({
      where: { slug: "home-decor" },
      create: { name: "Home Decor", slug: "home-decor" },
      update: {},
    }),
    prisma.category.upsert({
      where: { slug: "baby" },
      create: { name: "Baby", slug: "baby" },
      update: {},
    }),
    prisma.category.upsert({
      where: { slug: "accessories" },
      create: { name: "Accessories", slug: "accessories" },
      update: {},
    }),
    prisma.category.upsert({
      where: { slug: "gift-hampers" },
      create: { name: "Gift Hampers", slug: "gift-hampers" },
      update: {},
    }),
  ]);

  const [amigurumiCat, bagsCat, homeCat, babyCat, accessoriesCat, giftsCat] = categories;

  // ─── Discounts ────────────────────────────────────────
  let storeDiscount = await prisma.discount.findFirst({
    where: { code: null, scope: "STOREWIDE", name: "Festive 10% off" },
  });
  if (!storeDiscount) {
    storeDiscount = await prisma.discount.create({
      data: {
        name: "Festive 10% off",
        code: undefined,
        type: "PERCENTAGE",
        value: 10,
        scope: "STOREWIDE",
        startsAt: new Date("2026-01-01"),
        endsAt: new Date("2026-12-31"),
        isActive: true,
      },
    });
  }

  const amigurumiDiscount = await prisma.discount.create({
    data: {
      name: "Amigurumi 15% sale",
      code: null,
      type: "PERCENTAGE",
      value: 15,
      scope: "CATEGORY",
      categoryId: amigurumiCat.id,
      startsAt: new Date("2026-01-01"),
      endsAt: new Date("2026-12-31"),
      isActive: true,
    },
  }).catch(() => null);

  await prisma.discount.upsert({
    where: { code: "WELCOME10" },
    create: {
      name: "Welcome 10% off",
      code: "WELCOME10",
      type: "PERCENTAGE",
      value: 10,
      scope: "STOREWIDE",
      startsAt: new Date("2026-01-01"),
      isActive: true,
    },
    update: {},
  });

  // ─── Products ─────────────────────────────────────────
  const products = [
    // AMIGURUMI
    {
      name: "Amigurumi bunny",
      slug: "amigurumi-bunny",
      description: "A cuddly bunny in soft cotton yarn with embroidered eyes. Safe for babies and about 22 cm tall.",
      price: 999,
      categoryId: amigurumiCat.id,
      isFeatured: true,
      images: makeImages(PLACEHOLDER_IMAGES.amigurumi, "Amigurumi bunny"),
      details: { materials: "100% cotton yarn", care: "Hand wash cold", dimensions: "22 cm", colors: ["#F9C6DB", "#D9C9F4", "#CFEBDD"] },
    },
    {
      name: "Amigurumi octopus",
      slug: "amigurumi-octopus",
      description: "An adorable octopus plushie with eight little legs. Perfect as a sensory toy for babies.",
      price: 849,
      categoryId: amigurumiCat.id,
      isFeatured: true,
      images: makeImages(PLACEHOLDER_IMAGES.amigurumi, "Amigurumi octopus"),
      details: { materials: "Cotton yarn", care: "Hand wash cold", dimensions: "18 cm", colors: ["#B79AE6", "#F58FB5", "#CFEBDD"] },
    },
    {
      name: "Sunflower plushie",
      slug: "sunflower-plushie",
      description: "A cheerful sunflower stuffed toy, handmade in bright cotton. Great for nursery decor.",
      price: 749,
      categoryId: amigurumiCat.id,
      images: makeImages(PLACEHOLDER_IMAGES.amigurumi, "Sunflower plushie"),
      details: { materials: "Cotton yarn", care: "Hand wash cold", dimensions: "20 cm" },
    },

    // BAGS
    {
      name: "Granny-square tote bag",
      slug: "granny-square-tote-bag",
      description: "A classic granny-square tote bag in pastel colours. Roomy enough for groceries or a trip to the beach.",
      price: 1300,
      categoryId: bagsCat.id,
      isFeatured: true,
      images: makeImages(PLACEHOLDER_IMAGES.bags, "Granny-square tote"),
      details: { materials: "Acrylic yarn, cotton lining", care: "Spot clean", dimensions: "35 × 38 cm" },
    },
    {
      name: "Crochet bucket hat",
      slug: "crochet-bucket-hat",
      description: "Trendy crochet bucket hat, perfect for sunny days. One size fits most adults.",
      price: 799,
      categoryId: bagsCat.id,
      images: makeImages(PLACEHOLDER_IMAGES.bags, "Bucket hat"),
      details: { materials: "Cotton yarn", care: "Hand wash cold", dimensions: "Fits most adults" },
    },
    {
      name: "Phone pouch",
      slug: "phone-pouch",
      description: "A slim crochet phone pouch with a secure closure. Fits phones up to 6.7 inches.",
      price: 449,
      categoryId: bagsCat.id,
      images: makeImages(PLACEHOLDER_IMAGES.bags, "Phone pouch"),
      details: { materials: "Cotton yarn", care: "Spot clean", dimensions: "18 × 9 cm" },
    },

    // HOME DECOR
    {
      name: "Coaster set of 4",
      slug: "coaster-set",
      description: "A set of 4 matching crochet coasters in coordinating pastel colours. Protect your table in style.",
      price: 350,
      categoryId: homeCat.id,
      isFeatured: true,
      images: makeImages(PLACEHOLDER_IMAGES.home, "Coaster set"),
      details: { materials: "Cotton yarn", care: "Hand wash cold", dimensions: "10 cm diameter each" },
    },
    {
      name: "Wall hanging",
      slug: "wall-hanging",
      description: "A boho-style macramé-crochet wall hanging with fringe. Perfect for bedrooms and nurseries.",
      price: 1200,
      categoryId: homeCat.id,
      images: makeImages(PLACEHOLDER_IMAGES.home, "Wall hanging"),
      details: { materials: "Cotton yarn, wooden rod", care: "Dust gently", dimensions: "40 × 60 cm" },
    },
    {
      name: "Cushion cover",
      slug: "cushion-cover",
      description: "A hand-crocheted cushion cover with a textured daisy pattern. Fits 40 × 40 cm inserts.",
      price: 950,
      categoryId: homeCat.id,
      images: makeImages(PLACEHOLDER_IMAGES.home, "Cushion cover"),
      details: { materials: "Cotton yarn", care: "Hand wash cold", dimensions: "40 × 40 cm" },
    },
    {
      name: "Table runner",
      slug: "table-runner",
      description: "A delicate lace crochet table runner for special occasions or everyday elegance.",
      price: 1100,
      categoryId: homeCat.id,
      images: makeImages(PLACEHOLDER_IMAGES.home, "Table runner"),
      details: { materials: "Cotton yarn", care: "Hand wash cold", dimensions: "30 × 150 cm" },
    },

    // BABY
    {
      name: "Baby booties set",
      slug: "baby-booties-set",
      description: "Tiny, soft crochet booties for newborns to 3 months. A perfect baby shower gift.",
      price: 499,
      categoryId: babyCat.id,
      isFeatured: true,
      images: makeImages(PLACEHOLDER_IMAGES.baby, "Baby booties"),
      details: { materials: "Soft cotton yarn", care: "Hand wash cold", dimensions: "Newborn to 3 months" },
    },
    {
      name: "Mini cardigan for baby",
      slug: "mini-baby-cardigan",
      description: "A sweet little crochet cardigan for babies 0–6 months. Soft, warm and safe for sensitive skin.",
      price: 899,
      categoryId: babyCat.id,
      images: makeImages(PLACEHOLDER_IMAGES.baby, "Baby cardigan"),
      details: { materials: "Baby-safe cotton yarn", care: "Hand wash cold", dimensions: "0–6 months" },
    },
    {
      name: "Plant hanger",
      slug: "plant-hanger",
      description: "A crochet plant hanger for small to medium pots. Adds a boho touch to any corner.",
      price: 649,
      categoryId: babyCat.id,
      images: makeImages(PLACEHOLDER_IMAGES.baby, "Plant hanger"),
      details: { materials: "Macramé cotton cord", care: "Dust gently", dimensions: "Fits pots up to 15 cm" },
    },

    // ACCESSORIES
    {
      name: "Scrunchies pack",
      slug: "scrunchies-pack",
      description: "A pack of 3 crochet scrunchies in complementary colours. Gentle on hair and adorable to wear.",
      price: 299,
      categoryId: accessoriesCat.id,
      images: makeImages(PLACEHOLDER_IMAGES.accessories, "Scrunchies"),
      details: { materials: "Cotton yarn, hair-band elastic", care: "Hand wash cold", dimensions: "One size" },
    },
    {
      name: "Keychain minis",
      slug: "keychain-minis",
      description: "Mini amigurumi keychains — choose from bunny, octopus or bear. A sweet little companion.",
      price: 199,
      categoryId: accessoriesCat.id,
      images: makeImages(PLACEHOLDER_IMAGES.accessories, "Keychain minis"),
      details: { materials: "Cotton yarn, metal key ring", care: "Spot clean", dimensions: "8 cm" },
    },
    {
      name: "Laptop sleeve",
      slug: "laptop-sleeve",
      description: "A padded crochet laptop sleeve for 13-inch laptops. Unique and protective.",
      price: 1499,
      categoryId: accessoriesCat.id,
      images: makeImages(PLACEHOLDER_IMAGES.accessories, "Laptop sleeve"),
      details: { materials: "Acrylic yarn, foam padding", care: "Spot clean", dimensions: "35 × 25 cm" },
    },

    // GIFT HAMPERS
    {
      name: "Crochet flower bouquet",
      slug: "crochet-flower-bouquet",
      description: "An everlasting bouquet of handmade crochet flowers. Lasts forever, unlike real flowers!",
      price: 1199,
      categoryId: giftsCat.id,
      isFeatured: true,
      images: makeImages(PLACEHOLDER_IMAGES.gifts, "Flower bouquet"),
      details: { materials: "Cotton yarn, wire stems", care: "Dust gently", dimensions: "30 cm tall" },
    },
    {
      name: "Gift hamper set",
      slug: "gift-hamper-set",
      description: "A curated gift hamper with a small amigurumi, 2 coasters, 3 scrunchies and a keychain. Perfect for any occasion.",
      price: 1799,
      categoryId: giftsCat.id,
      images: makeImages(PLACEHOLDER_IMAGES.gifts, "Gift hamper"),
      details: { materials: "Mixed — see individual items", care: "Per item instructions", dimensions: "Various" },
    },
  ];

  console.log(`📦 Creating ${products.length} products...`);
  for (const p of products) {
    const { images, details, ...rest } = p;
    await prisma.product.upsert({
      where: { slug: p.slug },
      create: {
        ...rest,
        isActive: true,
        details: details ?? undefined,
        images: { create: images },
      },
      update: {},
    });
  }

  // ─── Admin user ───────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@oviyas.in";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@12345";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    create: {
      name: "Oviya",
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
    },
    update: { passwordHash, role: "ADMIN" },
  });

  // ─── Settings ─────────────────────────────────────────
  await prisma.setting.upsert({ where: { key: "shippingFee" }, create: { key: "shippingFee", value: 60 }, update: {} });
  await prisma.setting.upsert({ where: { key: "freeShippingThreshold" }, create: { key: "freeShippingThreshold", value: 1000 }, update: {} });
  await prisma.setting.upsert({ where: { key: "codEnabled" }, create: { key: "codEnabled", value: false }, update: {} });
  await prisma.setting.upsert({ where: { key: "storeName" }, create: { key: "storeName", value: "Oviya's Crochet" }, update: {} });
  await prisma.setting.upsert({ where: { key: "storeEmail" }, create: { key: "storeEmail", value: "hello@oviyas.in" }, update: {} });

  console.log("✅ Seed complete!");
  console.log(`   Admin email: ${adminEmail}`);
  console.log(`   Admin password: ${adminPassword}`);
  console.log("   ⚠️  Please change the admin password after first login!");
  console.log("   📸 Replace placeholder images with real product photos from Instagram!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
