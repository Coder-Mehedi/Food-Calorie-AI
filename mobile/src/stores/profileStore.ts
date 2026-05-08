import {create} from 'zustand';
import * as api from '@/services/api';
import type {UserProfile} from '@/types';

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  loadProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  loadProfile: async () => {
    set({isLoading: true});
    try {
      const {data} = await api.getProfile();
      set({profile: data, isLoading: false});
    } catch (err: any) {
      set({error: err.message, isLoading: false});
    }
  },

  updateProfile: async (updates) => {
    try {
      const {data} = await api.updateProfile(updates);
      set({profile: data});
    } catch (err: any) {
      set({error: err.message});
      throw err;
    }
  },
}));
