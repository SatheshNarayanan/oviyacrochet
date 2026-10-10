const fs = require('fs');
const path = require('path');

const pages = {
  'about': {
    title: 'Our Story: Handmade in Kanniyakumari',
    desc: 'Meet Oviya and her team, who crochet every piece by hand in Kanniyakumari. See how each made-to-order piece is made.'
  },
  'contact': {
    title: 'Contact Us',
    desc: 'Questions about an order or a custom piece? Contact Oviya\'s Crochet by email or Instagram. We reply as soon as we can.'
  },
  'faq': {
    title: 'FAQ: Orders, Shipping & Custom Pieces',
    desc: 'Answers about ordering, made-to-order timelines, shipping, payments and custom crochet requests.'
  },
  'custom-orders': {
    title: 'Custom Crochet Orders: Baby Outfits, Hats & Character Sets',
    desc: 'Request custom handmade crochet baby outfits, hats, keychains and superhero or anime-inspired sets. Send your idea and we\'ll reach back by email.'
  },
  'shipping-policy': {
    title: 'Shipping Policy',
    desc: 'How we pack and ship handmade crochet orders across India, with delivery times and charges.'
  },
  'returns-refunds': {
    title: 'Returns & Refunds',
    desc: 'Our returns and refund policy for handmade and made-to-order crochet pieces.'
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    desc: 'Privacy Policy'
  },
  'terms-of-service': {
    title: 'Terms of Service',
    desc: 'Terms of Service'
  },
  'data-sharing-opt-out': {
    title: 'Data Sharing Opt-Out',
    desc: 'Data Sharing Opt-Out'
  }
};

const storeDir = path.join(__dirname, 'app', '(store)');

for (const [slug, meta] of Object.entries(pages)) {
  const filePath = path.join(storeDir, slug, 'page.tsx');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    const newMetadata = `import { pageMetadata } from "@/lib/seo";\n\nexport const metadata: Metadata = pageMetadata({\n  title: "${meta.title}",\n  description: "${meta.desc}",\n  path: "/${slug}"\n});`;
    
    // Replace existing metadata export
    content = content.replace(/export const metadata: Metadata = \{[\s\S]*?\};/, newMetadata);
    
    // Remove duplicate imports if any
    content = content.replace(/import \{ pageMetadata \} from "@\/lib\/seo";\n\nimport \{ pageMetadata \}/, 'import { pageMetadata }');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${slug}`);
  }
}
