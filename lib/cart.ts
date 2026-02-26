// lib/cart.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getCart,
  upsertCartItem,
  removeCartItem,
  updateCartItemQuantity,
} from "@/actions/cart";

// ✨ آیتم سبد
export interface CartItem {
  id?: string; // ID آیتم در دیتابیس (وقتی از سرور می‌آید)
  productId: string;
  title: string;
  price: number;
  image?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isInitialized: boolean;

  initializeCart: () => Promise<void>;

  addToCart: (newItem: Omit<CartItem, "quantity" | "id">) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, newQuantity: number) => Promise<void>;

  clearCart: () => void;

  totalItems: () => number;
  totalPrice: () => number;
}

// کمک: تشخیص خروجی AUTH_REQUIRED از server action
function isAuthRequired(res: any) {
  return res && typeof res === "object" && res.ok === false && res.reason === "AUTH_REQUIRED";
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isInitialized: false,

      /**
       * سبد خرید را از سرور واکشی می‌کند.
       * - اگر کاربر لاگین باشد و سبد سرور داشته باشد: سرور را منبع اصلی قرار می‌دهیم.
       * - اگر لاگین نباشد: همان سبد لوکال حفظ می‌شود.
       */
      initializeCart: async () => {
        if (get().isInitialized) return;

        try {
          const serverCart = await getCart();

          // اگر لاگین نیست یا سبد سرور وجود ندارد
          if (!serverCart) {
            set({ isInitialized: true });
            return;
          }

          // سبد سرور وجود دارد => سرور را منبع اصلی قرار می‌دهیم
          const serverItems: CartItem[] = serverCart.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            title: item.product.title,
            price: item.product.price,
            image: item.product.images?.[0],
            quantity: item.quantity,
          }));

          set({ items: serverItems, isInitialized: true });
        } catch (error) {
          // اگر سرور در دسترس نبود/خطا داد، سبد لوکال را نگه دار
          console.error("Failed to initialize cart from server:", error);
          set({ isInitialized: true });
        }
      },

      /**
       * افزودن محصول به سبد (لوکال‌محور)
       * - اول UI/لوکال را آپدیت می‌کنیم
       * - سپس اگر لاگین بود، روی سرور هم ثبت می‌کنیم
       */
      addToCart: async (newItem) => {
        // Optimistic UI (لوکال)
        const existingItem = get().items.find((i) => i.productId === newItem.productId);

        if (existingItem) {
          // این خودش server call هم دارد ولی ما در updateQuantity هندل می‌کنیم
          await get().updateQuantity(newItem.productId, existingItem.quantity + 1);
        } else {
          set((state) => ({
            items: [...state.items, { ...newItem, quantity: 1 }],
          }));
        }

        // تلاش برای sync با سرور (فقط اگر لاگین بود)
        try {
          const res = await upsertCartItem(newItem.productId);

          // اگر لاگین نبود => هیچ کاری نکن، سبد لوکال کافی است
          if (isAuthRequired(res)) return;
        } catch (error) {
          // سرور مشکل داشت => سبد لوکال همچنان معتبر است
          console.error("Failed to add to cart on server:", error);
          // (اختیاری) Rollback انجام نده، چون هدف حفظ سبد لوکال است
        }
      },

      /**
       * حذف کامل یک محصول از سبد
       */
      removeFromCart: async (productId) => {
        const originalItems = get().items;

        // Optimistic UI (لوکال)
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));

        // تلاش برای sync با سرور
        try {
          const res = await removeCartItem(productId);

          // اگر لاگین نبود => OK، فقط لوکال را نگه دار
          if (isAuthRequired(res)) return;
        } catch (error) {
          console.error("Failed to remove from cart on server:", error);
          // اگر سرور خطا داد، لوکال را برگردان (چون اقدام حذف ممکن است سرور-محور باشد)
          set({ items: originalItems });
        }
      },

      /**
       * به‌روزرسانی تعداد یک محصول خاص
       */
      updateQuantity: async (productId, newQuantity) => {
        if (newQuantity <= 0) {
          await get().removeFromCart(productId);
          return;
        }

        const originalItems = get().items;

        // Optimistic UI (لوکال)
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity: newQuantity } : i
          ),
        }));

        // تلاش برای sync با سرور
        try {
          const res = await updateCartItemQuantity(productId, newQuantity);

          // اگر لاگین نبود => لوکال کافی است
          if (isAuthRequired(res)) return;
        } catch (error) {
          console.error("Failed to update quantity on server:", error);
          set({ items: originalItems }); // Rollback فقط وقتی سرور error واقعی داده
        }
      },

      /**
       * خالی کردن کامل سبد (فقط لوکال)
       */
      clearCart: () => {
        set({ items: [] });
      },

      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      totalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
      // (اختیاری) فقط items را persist کن تا isInitialized با رفرش به حالت درست برگردد
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// اگر خواستی در جاهای غیر-React به state دسترسی داشته باشی:
// export const cartStore = useCart;
