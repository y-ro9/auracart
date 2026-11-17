import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, size: string, color: string) => void;
  removeItem: (id: string, size: string, color: string) => void;
  clearCart: () => void;
  getTotal: (isUnlocked: boolean) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, size, color) => {
        const { items } = get();
        const existing = items.find(i => i.id === product.id && i.selectedSize === size && i.selectedColor === color);
        if (existing) {
          set({ items: items.map(i => i.id === product.id && i.selectedSize === size ? { ...i, quantity: i.quantity + 1 } : i) });
        } else {
          set({ items: [...items, { ...product, selectedSize: size, selectedColor: color, quantity: 1 }] });
        }
      },
      removeItem: (id, size, color) => set({ items: get().items.filter(i => !(i.id === id && i.selectedSize === size && i.selectedColor === color)) }),
      clearCart: () => set({ items: [] }),
      getTotal: (isUnlocked) => get().items.reduce((total, item) => total + (isUnlocked ? 299 : item.basePrice) * item.quantity, 0),
    }),
    { name: 'auracart-cart' }
  )
);