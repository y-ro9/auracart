export type Category = 'Male' | 'Female' | 'Baby';
export type ProductType = 'Clothing' | 'Accessories';

export interface Product {
  id: string;
  name: string;
  category: Category;
  type: ProductType;
  basePrice: number;
  images: string[];
  description: string;
  sizes: string[];
  colors: string[];
  isActive: boolean;
}

export interface CartItem extends Product {
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}