import { Product } from '../types';

export function normalizeDriveUrl(url: string): string {
  if (!url) return '';
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) return `https://lh3.googleusercontent.com/d/${match[1]}`;
  return url;
}

export const initialProducts: Product[] = [
  {
    id: 'p1', name: 'Pastel Pink Oversized Hoodie', category: 'Female', type: 'Clothing',
    basePrice: 2500, images: ['https://i.ibb.co/your-image-1.jpg', 'https://i.ibb.co/your-image-2.jpg'],
    description: 'Premium quality ultra-soft hoodie.', sizes: ['S', 'M', 'L'], colors: ['Pink'], isActive: true,
  },
  {
    id: 'p2', name: 'Ice Blue Cargo Pants', category: 'Male', type: 'Clothing',
    basePrice: 2800, images: ['https://i.ibb.co/your-image-1.jpg', 'https://i.ibb.co/your-image-2.jpg'],
    description: 'Relaxed fit streetwear cargo.', sizes: ['M', 'L', 'XL'], colors: ['Blue'], isActive: true,
  },
  {
    id: 'p3', name: 'Lilac Baby Romper', category: 'Baby', type: 'Clothing',
    basePrice: 2500, images: ['https://i.ibb.co/your-image-1.jpg', 'https://i.ibb.co/your-image-2.jpg'],
    description: 'Organic cotton romper for babies.', sizes: ['0-3M', '3-6M'], colors: ['Lilac'], isActive: true,
  },
  {
    id: 'p4', name: 'Blush Pearl Necklace', category: 'Female', type: 'Accessories',
    basePrice: 3200, images: ['https://i.ibb.co/your-image-1.jpg', 'https://i.ibb.co/your-image-2.jpg'],
    description: 'Handcrafted elegant pearl necklace.', sizes: ['Free Size'], colors: ['Blush'], isActive: true,
  },
];