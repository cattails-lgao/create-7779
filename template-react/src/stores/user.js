import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, devtools } from 'zustand/middleware';
import { login } from '@/api/user';

export const useUserStore = create(
  devtools(
    persist(
      immer((set) => ({
        userInfo: null,
        setUserInfo: (userInfo) => set({ userInfo }),
        login: async (data) => {
          try {
            const rsp = await login(data);

            set({ userInfo: rsp.data }); // 设置用户信息

            return true;
          } catch (err) {
            console.error(err);
            return false;
          }
        },
      })),
      {
        name: 'user',
      }
    ),
    {
      name: 'user',
    }
  )
);
