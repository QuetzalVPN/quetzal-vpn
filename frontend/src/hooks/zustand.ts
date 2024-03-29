import { create } from "zustand";

interface CurrentPageState {
  currentPage: number;
  move: (to: number) => void;
}

interface TitleState {
  title: string;
  change: (to: string) => void;
}

interface SidebarState {
  sidebar: boolean;
  setSidebar: (to: boolean) => void;
}

const useCurrentPage = create<CurrentPageState>((set) => ({
  currentPage: 0,
  move: (to) => set((state) => ({ currentPage: to }))
}));

const useTitleState = create<TitleState>((set) => ({
  title: "Home",
  change: (to) => {
    document.title = to;
    return set((state) => ({ title: to }));
  }
}));

const useSidebarState = create<SidebarState>((set) => ({
  sidebar: false,
  setSidebar: (to) => set((state) => ({ sidebar: to }))
}));

export { useCurrentPage, useTitleState, useSidebarState };
