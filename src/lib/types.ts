export type ProductVariation = {
  id: string;
  name: string;
  imageUrl: string;
  imageHint: string;
  price: number;
  stock: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  stock: number; // General stock, can be overridden by variations
  variations: ProductVariation[];
  // Keep a reference to the primary image for list views
  imageUrl: string; 
  imageHint: string;
  price: number; // Base price for display
};
