import { create } from "zustand";

type SidebarMode = "full" | "mini";

type UiState = {
  sidebarMode: SidebarMode;
  mobileOpen: boolean;
  toggleSidebarMode: () => void;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  sidebarMode: "full",
  mobileOpen: false,

  toggleSidebarMode: () =>
    set((s) => ({
      sidebarMode: s.sidebarMode === "full" ? "mini" : "full",
    })),

  toggleMobileSidebar: () =>
    set((s) => ({ mobileOpen: !s.mobileOpen })),

  closeMobileSidebar: () =>
    set({ mobileOpen: false }),
}));