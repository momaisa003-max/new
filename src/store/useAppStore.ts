import { create } from 'zustand';
import type { AppView } from '@/lib/types';

interface AppState {
  view: AppView;
  navigate: (view: AppView) => void;
  goHome: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  view: { page: 'home' },
  navigate: (view) => {
    set({ view });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
  goHome: () => set({ view: { page: 'home' } }),
}));
