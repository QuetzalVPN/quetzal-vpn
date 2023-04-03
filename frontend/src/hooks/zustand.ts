import { create } from 'zustand';

interface CurrentPageState {
  currentPage: number;
  move: (to: number) => void;
}

const useCurrentPage = create<CurrentPageState>((set) => ({
  currentPage: 0,
  move: (to) => set((state) => ({ currentPage: to })),
}));

export { useCurrentPage };
