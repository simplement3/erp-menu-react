import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem { id_producto: number; nombre: string; precio: number; cantidad: number; }
interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'cantidad'> & { cantidad?: number }) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, cantidad: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) =>
        set((state) => {
          const existing = state.items.find((i) => i.id_producto === newItem.id_producto);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id_producto === newItem.id_producto
                  ? { ...i, cantidad: i.cantidad + (newItem.cantidad || 1) }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...newItem, cantidad: newItem.cantidad || 1 }] };
        }),
      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id_producto !== id) })),
      updateQuantity: (id, cantidad) =>
        set((state) => ({
          items: state.items.map((i) => (i.id_producto === id ? { ...i, cantidad } : i)),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: 'cart-storage' } // LocalStorage key
  )
);

// Selector para total (CLP format)
export const useCartTotal = () => {
  const { items } = useCartStore();
  return items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
};