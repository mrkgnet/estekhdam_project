// store/useUiStore.ts
import { create } from "zustand";

type UiState = {
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  isSidebarOpen: true, // مقدار اولیه مهم نیست، پایین با useEffect اصلاح می‌کنیم
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
}));