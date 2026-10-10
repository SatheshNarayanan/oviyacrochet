export type DesignItem = "outfit" | "hat" | "keychain" | "accessories";

export type CustomDesign = {
  id: string;
  character: "Batman" | "Spider-Man" | "Naruto" | "Luffy" | "Zoro";
  item: DesignItem;
  title: string;
  blurb: string;
  image: string;
  alt: string;
  source: "ai" | "real";
};

export const customDesigns: CustomDesign[] = [
  // Batman
  { id: "batman-outfit", character: "Batman", item: "outfit", title: "Batman-inspired baby outfit", blurb: "Dark cowl with ears, cape and gauntlet cuffs, finished with a bold yellow accent.", image: "/images/custom/batman/batman-outfit.jpg", alt: "Handmade crochet Batman-inspired baby outfit set shown flat on a linen surface", source: "ai" },
  { id: "batman-hat", character: "Batman", item: "hat", title: "Batman-inspired cowl hat", blurb: "Dark cowl with ears, cape and gauntlet cuffs, finished with a bold yellow accent.", image: "/images/custom/batman/batman-hat.jpg", alt: "Handmade crochet Batman-inspired baby beanie with pointed ears shown flat on a linen surface", source: "ai" },
  { id: "batman-keychain", character: "Batman", item: "keychain", title: "Batman-inspired keychain", blurb: "Dark cowl with ears, cape and gauntlet cuffs, finished with a bold yellow accent.", image: "/images/custom/batman/batman-keychain.webp", alt: "Handmade crochet Batman-inspired mini amigurumi keychain shown flat on a linen surface", source: "ai" },
  { id: "batman-accessories", character: "Batman", item: "accessories", title: "Batman-inspired accessories", blurb: "Dark cowl with ears, cape and gauntlet cuffs, finished with a bold yellow accent.", image: "/images/custom/batman/batman-accessories.webp", alt: "Handmade crochet Batman-inspired baby accessories shown flat on a linen surface", source: "ai" },
  // Spider-Man
  { id: "spiderman-outfit", character: "Spider-Man", item: "outfit", title: "Spider-Man-inspired baby outfit", blurb: "Red and blue bodysuit, web details and a hat with white eye lenses.", image: "/images/custom/spiderman/spiderman-outfit.jpg", alt: "Handmade crochet Spider-Man-inspired baby outfit set shown flat on a linen surface", source: "ai" },
  { id: "spiderman-hat", character: "Spider-Man", item: "hat", title: "Spider-Man-inspired hat", blurb: "Red and blue bodysuit, web details and a hat with white eye lenses.", image: "/images/custom/spiderman/spiderman-hat.jpg", alt: "Handmade crochet Spider-Man-inspired baby beanie with eye lenses shown flat on a linen surface", source: "ai" },
  { id: "spiderman-keychain", character: "Spider-Man", item: "keychain", title: "Spider-Man-inspired keychain", blurb: "Red and blue bodysuit, web details and a hat with white eye lenses.", image: "/images/custom/spiderman/spiderman-keychain.jpg", alt: "Handmade crochet Spider-Man-inspired mini amigurumi keychain shown flat on a linen surface", source: "ai" },
  { id: "spiderman-accessories", character: "Spider-Man", item: "accessories", title: "Spider-Man-inspired accessories", blurb: "Red and blue bodysuit, web details and a hat with white eye lenses.", image: "/images/custom/spiderman/spiderman-accessories.jpg", alt: "Handmade crochet Spider-Man-inspired baby accessories shown flat on a linen surface", source: "ai" },
  // Naruto
  { id: "naruto-outfit", character: "Naruto", item: "outfit", title: "Naruto-inspired baby outfit", blurb: "Orange and navy jacket set with a headband and spiky-hair hat.", image: "/images/custom/naruto/naruto-outfit.jpg", alt: "Handmade crochet Naruto-inspired baby outfit set shown flat on a linen surface", source: "ai" },
  { id: "naruto-hat", character: "Naruto", item: "hat", title: "Naruto-inspired hat", blurb: "Orange and navy jacket set with a headband and spiky-hair hat.", image: "/images/custom/naruto/naruto-hat.jpg", alt: "Handmade crochet Naruto-inspired yellow spiky-hair beanie shown flat on a linen surface", source: "ai" },
  { id: "naruto-keychain", character: "Naruto", item: "keychain", title: "Naruto-inspired keychain", blurb: "Orange and navy jacket set with a headband and spiky-hair hat.", image: "/images/custom/naruto/naruto-keychain.jpg", alt: "Handmade crochet Naruto-inspired mini amigurumi keychain shown flat on a linen surface", source: "ai" },
  { id: "naruto-accessories", character: "Naruto", item: "accessories", title: "Naruto-inspired accessories", blurb: "Orange and navy jacket set with a headband and spiky-hair hat.", image: "/images/custom/naruto/naruto-accessories.jpg", alt: "Handmade crochet Naruto-inspired baby accessories shown flat on a linen surface", source: "ai" },
  // Luffy
  { id: "luffy-outfit", character: "Luffy", item: "outfit", title: "Luffy-inspired baby outfit", blurb: "Straw-hat style cap with a red band, red vest and blue shorts.", image: "/images/custom/luffy/luffy-outfit.jpg", alt: "Handmade crochet Luffy-inspired baby outfit set shown flat on a linen surface", source: "ai" },
  { id: "luffy-hat", character: "Luffy", item: "hat", title: "Luffy-inspired hat", blurb: "Straw-hat style cap with a red band, red vest and blue shorts.", image: "/images/custom/luffy/luffy-hat.jpg", alt: "Handmade crochet Luffy-inspired straw-hat style cap shown flat on a linen surface", source: "ai" },
  { id: "luffy-keychain", character: "Luffy", item: "keychain", title: "Luffy-inspired keychain", blurb: "Straw-hat style cap with a red band, red vest and blue shorts.", image: "/images/custom/luffy/luffy-keychain.jpg", alt: "Handmade crochet Luffy-inspired mini amigurumi keychain shown flat on a linen surface", source: "ai" },
  { id: "luffy-accessories", character: "Luffy", item: "accessories", title: "Luffy-inspired accessories", blurb: "Straw-hat style cap with a red band, red vest and blue shorts.", image: "/images/custom/luffy/luffy-accessories.jpg", alt: "Handmade crochet Luffy-inspired baby accessories shown flat on a linen surface", source: "ai" },
  // Zoro
  { id: "zoro-outfit", character: "Zoro", item: "outfit", title: "Zoro-inspired baby outfit", blurb: "Deep green coat with a red sash, green hat and miniature crochet swords.", image: "/images/custom/zoro/zoro-outfit.jpg", alt: "Handmade crochet Zoro-inspired baby outfit set shown flat on a linen surface", source: "ai" },
  { id: "zoro-hat", character: "Zoro", item: "hat", title: "Zoro-inspired hat", blurb: "Deep green coat with a red sash, green hat and miniature crochet swords.", image: "/images/custom/zoro/zoro-hat.jpg", alt: "Handmade crochet Zoro-inspired fuzzy green hat shown flat on a linen surface", source: "ai" },
  { id: "zoro-keychain", character: "Zoro", item: "keychain", title: "Zoro-inspired keychain", blurb: "Deep green coat with a red sash, green hat and miniature crochet swords.", image: "/images/custom/zoro/zoro-keychain.jpg", alt: "Handmade crochet Zoro-inspired mini amigurumi keychain shown flat on a linen surface", source: "ai" },
  { id: "zoro-accessories", character: "Zoro", item: "accessories", title: "Zoro-inspired accessories", blurb: "Deep green coat with a red sash, green hat and miniature crochet swords.", image: "/images/custom/zoro/zoro-accessories.jpg", alt: "Handmade crochet Zoro-inspired baby accessories shown flat on a linen surface", source: "ai" }
];
