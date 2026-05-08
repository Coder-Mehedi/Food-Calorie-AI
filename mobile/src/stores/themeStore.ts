import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeState {
  isDark: boolean;
  toggle: () => void;
  loadTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  isDark: false,

  loadTheme: async () => {
    const val = await AsyncStorage.getItem('isDark');
    set({isDark: val === 'true'});
  },

  toggle: () => {
    const next = !get().isDark;
    AsyncStorage.setItem('isDark', String(next));
    set({isDark: next});
  },
}));
