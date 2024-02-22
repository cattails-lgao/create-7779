import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools, persist } from 'zustand/middleware';

export const useMenuStore = create(
  devtools(
    persist(
      immer((set) => ({
        menu: [],
        setMenu: (menu) => set({ menu }),
        tag: [],
        setTag: (tag) => set({ tag }),
      })),
      {
        name: 'menu',
      }
    ),
    {
      name: 'menu',
    }
  )
);
