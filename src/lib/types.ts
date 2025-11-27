export interface ProductType {
  id: number;
  name: string;
  image: string;
}

export interface ProductSize {
  price: number;
  discountPrice?: number;
  discountQuantity?: number;
  images: string[];
}

export interface SocialProof {
  image: string;
  text: string;
  author: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  isFeatured?: boolean;
  isOnSale?: boolean;
  
  // New detailed fields
  sold?: number;
  images?: string[];
  types?: ProductType[];
  previewImages?: string[];
  sizes?: Record<string, ProductSize>;
  hasColors?: boolean;
  hasSizes?: boolean;
  hasTypes?: boolean;
  socialProof?: SocialProof[];
}

export interface CartItem extends Product {
  quantity: number;
  // Add selected size/type if applicable in the future
  selectedSize?: string;
  selectedType?: string;
}
