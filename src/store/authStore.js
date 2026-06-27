import { create } from 'zustand';

export const authStore = create(set => ({
  user: null,
  token: null,

  setAuth: (user, token) =>
    set({
      user,
      token,
    }),

  setUser: user =>
    set({
      user,
    }),

  logout: () =>
    set({
      user: null,
      token: null,
    }),
}));
