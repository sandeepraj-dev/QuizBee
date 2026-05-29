import { create } from 'zustand';

export const authStore = create(set => ({
  user: null,
  token: null,

  setAuth: (user, token) =>
    set({
      user,
      token,
    }),

  logout: () =>
    set({
      user: null,
      token: null,
    }),
}));
