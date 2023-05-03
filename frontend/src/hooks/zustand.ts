import {create} from 'zustand';

interface CurrentPageState {
  currentPage: number;
  move: (to: number) => void;
}

interface TitleState {
  title: string;
  change: (to: string) => void;
}

interface LoginState {
  loggedIn: boolean;
  setLoggedIn: (to: boolean) => void;
}

const useCurrentPage = create<CurrentPageState>((set) => ({
  currentPage: 0,
  move: (to) => set((state) => ({currentPage: to})),
}));

const useTitleState = create<TitleState>((set) => ({
  title: 'Home',
  change: (to) => {
    document.title = to;
    return set((state) => ({title: to}));
  },
}));

// const useLoginState = create<LoginState>((set) => ({
//   loggedIn: localStorage.getItem('loggedIn') === 'true',
//   setLoggedIn: (to: boolean) => {
//     if (to) localStorage.setItem('loggedIn', 'true');
//     else localStorage.removeItem('loggedIn');
//     return set((state) => ({loggedIn: to}));
//   },
// }));

export {useCurrentPage, useTitleState, /*useLoginState*/};
