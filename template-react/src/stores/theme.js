import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, devtools } from 'zustand/middleware';

export const useThemeStore = create(
  devtools(
    persist(
      immer((set) => ({
        colorPrimary: '#49a031',
        setColorPrimary: (color) => set({ colorPrimary: color }),
      })),
      {
        name: 'theme',
      }
    ),
    {
      name: 'theme',
    }
  )
);
