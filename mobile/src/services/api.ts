import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import {Platform} from 'react-native';

const API_BASE_URL = __DEV__
  ? Platform.select({
      android: 'https://foodcalorieai.duckdns.org/api',
      ios: 'https://foodcalorieai.duckdns.org/api',
      default: 'https://foodcalorieai.duckdns.org/api',
    })
  : 'https://foodcalorieai.duckdns.org/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {'Content-Type': 'application/json'},
});

api.interceptors.request.use(async config => {
  const token = await SecureStore.getItemAsync('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('auth_token');
    }
    return Promise.reject(error);
  },
);

// Auth
export const login = (email: string, password: string) =>
  api.post('/auth/login', {email, password});

export const register = (name: string, email: string, password: string) =>
  api.post('/auth/register', {name, email, password});

// Food Analysis
export const analyzeFood = (imageUri: string) => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'food_image.jpg',
  } as any);

  return api.post('/analyze-food', formData, {
    headers: {'Content-Type': 'multipart/form-data'},
    timeout: 60000,
  });
};

// Meals
export const saveMeal = (data: {
  imageUrl: string;
  mealType: string;
  foods: any[];
  notes?: string;
}) => api.post('/meals', data);

export const getMeals = (params?: {
  date?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) => api.get('/meals', {params});

export const deleteMeal = (mealId: string) =>
  api.delete(`/meals/${mealId}`);

// Profile
export const getProfile = () => api.get('/profile');

export const updateProfile = (data: Record<string, any>) =>
  api.put('/profile', data);

// Nutrition
export const getDailySummary = (date: string) =>
  api.get('/meals/daily-summary', {params: {date}});

export const getWeeklyReport = (startDate: string) =>
  api.get('/meals/weekly', {params: {startDate}});

export const getGoals = () => api.get('/nutrition/goals');

export const createGoal = (data: any) => api.post('/nutrition/goals', data);

export default api;
