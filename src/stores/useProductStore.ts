import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';
import { initialProducts } from '../data/products';

interface ProductState {
  products: Product[];
  addProduct: (p: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  toggleActive: (id: string) => void;
  deleteProduct: (id: string) => void;
  resetToDefaults: () => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: initialProducts,
      addProduct: (p) => set({ products: [p, ...get().products] }),
      updateProduct: (id, updates) =>
        set({
          products: get().products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }),
      toggleActive: (id) =>
        set({
          products: get().products.map((p) =>
            p.id === id ? { ...p, isActive: !p.isActive } : p
          ),
        }),
      deleteProduct: (id) =>
        set({ products: get().products.filter((p) => p.id !== id) }),
      resetToDefaults: () => set({ products: initialProducts }),
    }),
    { name: 'auracart-products' }
  )
);
