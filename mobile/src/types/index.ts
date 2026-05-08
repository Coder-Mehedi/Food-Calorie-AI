export interface FoodItem {
  name: string;
  quantity: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  confidence: number;
}

export interface Meal {
  id: string;
  imageUrl: string;
  mealType: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  totalSugar: number;
  notes?: string;
  items: FoodItem[];
  consumedAt: string;
}

export interface AnalysisResult {
  foods: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  imageUrl: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  height?: number;
  weight?: number;
  age?: number;
  gender?: string;
  fitnessGoal?: string;
  dailyCalorieTarget?: number;
}

export interface DailySummary {
  date: string;
  mealCount: number;
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
}

export interface WeeklyData {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealCount: number;
}

export interface AuthResponse {
  accessToken: string;
  user: UserProfile;
}

export interface MealsResponse {
  meals: Meal[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
