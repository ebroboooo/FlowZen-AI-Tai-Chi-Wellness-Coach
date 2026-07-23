/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';

interface AuthState {
  currentUser: any;
  isAuthenticated: boolean;
  guestMode: boolean;
  setGuestMode: (guest: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: { uid: 'local_user', displayName: 'Zen Practitioner' },
  isAuthenticated: true,
  guestMode: true,
  setGuestMode: (guestMode) => set({ guestMode })
}));
