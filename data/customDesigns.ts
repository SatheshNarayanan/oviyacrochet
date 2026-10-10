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

export const customDesigns: CustomDesign[] = [];
