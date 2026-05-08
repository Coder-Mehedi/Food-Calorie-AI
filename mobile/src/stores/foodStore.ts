import {create} from 'zustand';
import * as api from '@/services/api';
import type {AnalysisResult, Meal, MealType} from '@/types';

interface FoodState {
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  error: string | null;

  meals: Meal[];
  mealsLoading: boolean;
  mealsPage: number;
  mealsHasMore: boolean;

  analyzeImage: (imageUri: string) => Promise<void>;
  saveMeal: (mealType: MealType, foods: any[], imageUrl: string) => Promise<Meal>;
  loadMeals: (refresh?: boolean) => Promise<void>;
  deleteMeal: (id: string) => Promise<void>;
  reset: () => void;
}

export const useFoodStore = create<FoodState>((set, get) => ({
  isAnalyzing: false,
  result: null,
  error: null,
  meals: [],
  mealsLoading: false,
  mealsPage: 1,
  mealsHasMore: true,

  analyzeImage: async (imageUri: string) => {
    set({isAnalyzing: true, error: null});
    try {
      const {data} = await api.analyzeFood(imageUri);
      set({isAnalyzing: false, result: data});
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Analysis failed';
      set({isAnalyzing: false, error: msg});
      throw new Error(msg);
    }
  },

  saveMeal: async (mealType, foods, imageUrl) => {
    const {data} = await api.saveMeal({imageUrl, mealType, foods});
    const state = get();
    set({meals: [data, ...state.meals]});
    return data;
  },

  loadMeals: async (refresh = false) => {
    const state = get();
    if (state.mealsLoading) return;
    if (!refresh && !state.mealsHasMore) return;

    const page = refresh ? 1 : state.mealsPage;
    set({mealsLoading: true});

    try {
      const {data} = await api.getMeals({page, limit: 20});
      set({
        meals: refresh ? data.meals : [...state.meals, ...data.meals],
        mealsLoading: false,
        mealsPage: page + 1,
        mealsHasMore: page < data.totalPages,
      });
    } catch {
      set({mealsLoading: false});
    }
  },

  deleteMeal: async (id) => {
    await api.deleteMeal(id);
    set(s => ({meals: s.meals.filter(m => m.id !== id)}));
  },

  reset: () => set({isAnalyzing: false, result: null, error: null}),
}));
