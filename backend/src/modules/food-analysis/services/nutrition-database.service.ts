import { Injectable, Logger } from '@nestjs/common';

export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

// Comprehensive nutrition database per 100g
const NUTRITION_DB: Record<string, NutritionData> = {
  // Proteins
  'chicken breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74 },
  'grilled chicken': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74 },
  'beef steak': { calories: 271, protein: 26, carbs: 0, fat: 18, fiber: 0, sugar: 0, sodium: 54 },
  'salmon': { calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, sugar: 0, sodium: 59 },
  'tuna': { calories: 144, protein: 23, carbs: 0, fat: 5, fiber: 0, sugar: 0, sodium: 39 },
  'shrimp': { calories: 99, protein: 24, carbs: 0.2, fat: 0.3, fiber: 0, sugar: 0, sodium: 111 },
  'pork chop': { calories: 231, protein: 25, carbs: 0, fat: 14, fiber: 0, sugar: 0, sodium: 62 },
  'turkey': { calories: 135, protein: 30, carbs: 0, fat: 1, fiber: 0, sugar: 0, sodium: 52 },
  'lamb': { calories: 294, protein: 25, carbs: 0, fat: 21, fiber: 0, sugar: 0, sodium: 72 },
  'tofu': { calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3, sugar: 0.5, sodium: 7 },
  'egg': { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, sugar: 1.1, sodium: 124 },
  'fried egg': { calories: 196, protein: 14, carbs: 0.9, fat: 15, fiber: 0, sugar: 0.4, sodium: 195 },

  // Fast food
  'burger': { calories: 354, protein: 17, carbs: 29, fat: 20, fiber: 1.3, sugar: 5.4, sodium: 613 },
  'cheeseburger': { calories: 410, protein: 24, carbs: 32, fat: 21, fiber: 1.5, sugar: 6.3, sodium: 792 },
  'pizza': { calories: 266, protein: 11, carbs: 33, fat: 10, fiber: 2.3, sugar: 3.6, sodium: 598 },
  'french fries': { calories: 312, protein: 3.4, carbs: 41, fat: 15, fiber: 3.8, sugar: 0.3, sodium: 210 },
  'hot dog': { calories: 290, protein: 10, carbs: 24, fat: 17, fiber: 0.8, sugar: 4.2, sodium: 710 },
  'fried chicken': { calories: 246, protein: 19, carbs: 11, fat: 15, fiber: 0.5, sugar: 0.3, sodium: 420 },
  'sandwich': { calories: 250, protein: 12, carbs: 28, fat: 10, fiber: 1.8, sugar: 3.5, sodium: 560 },
  'taco': { calories: 226, protein: 10, carbs: 21, fat: 12, fiber: 3.2, sugar: 1.6, sodium: 510 },
  'burrito': { calories: 206, protein: 9, carbs: 26, fat: 8, fiber: 2.5, sugar: 1.3, sodium: 520 },
  'sushi': { calories: 143, protein: 6, carbs: 24, fat: 2.8, fiber: 0.4, sugar: 4.8, sodium: 390 },
  'noodles': { calories: 138, protein: 4.5, carbs: 25, fat: 2.1, fiber: 1.8, sugar: 0.6, sodium: 360 },
  'pasta': { calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8, sugar: 0.6, sodium: 1 },
  'spaghetti': { calories: 158, protein: 5.8, carbs: 31, fat: 0.9, fiber: 1.8, sugar: 0.6, sodium: 1 },
  'ramen': { calories: 436, protein: 10, carbs: 53, fat: 20, fiber: 2, sugar: 3, sodium: 1500 },

  // Rice dishes
  'white rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sugar: 0.1, sodium: 1 },
  'fried rice': { calories: 163, protein: 4.1, carbs: 22, fat: 6.3, fiber: 1, sugar: 0.5, sodium: 400 },
  'biryani': { calories: 195, protein: 6, carbs: 28, fat: 7, fiber: 1.2, sugar: 1.5, sodium: 350 },
  'curry': { calories: 150, protein: 7, carbs: 10, fat: 9, fiber: 2, sugar: 3, sodium: 400 },
  'dal': { calories: 116, protein: 7, carbs: 20, fat: 0.8, fiber: 7.9, sugar: 1.2, sodium: 240 },

  // Bread
  'bread': { calories: 265, protein: 9, carbs: 49, fat: 3.2, fiber: 2.7, sugar: 5, sodium: 491 },
  'toast': { calories: 313, protein: 11, carbs: 58, fat: 4, fiber: 3, sugar: 6, sodium: 580 },
  'croissant': { calories: 406, protein: 8, carbs: 45, fat: 21, fiber: 2.6, sugar: 11, sodium: 424 },
  'bagel': { calories: 250, protein: 10, carbs: 49, fat: 1.5, fiber: 1.6, sugar: 5, sodium: 430 },
  'naan': { calories: 290, protein: 9, carbs: 50, fat: 6, fiber: 2.5, sugar: 4, sodium: 450 },

  // Fruits
  'apple': { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, sugar: 10.4, sodium: 1 },
  'banana': { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, sugar: 12, sodium: 1 },
  'orange': { calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4, sugar: 9.4, sodium: 0 },
  'strawberry': { calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2, sugar: 4.9, sodium: 1 },
  'grape': { calories: 69, protein: 0.7, carbs: 18, fat: 0.2, fiber: 0.9, sugar: 15, sodium: 2 },
  'watermelon': { calories: 30, protein: 0.6, carbs: 8, fat: 0.2, fiber: 0.4, sugar: 6, sodium: 1 },
  'mango': { calories: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6, sugar: 13.7, sodium: 1 },

  // Vegetables
  'salad': { calories: 20, protein: 1.5, carbs: 3.3, fat: 0.2, fiber: 2.1, sugar: 1.7, sodium: 28 },
  'broccoli': { calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, sugar: 1.7, sodium: 33 },
  'carrot': { calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8, sugar: 4.7, sodium: 69 },
  'corn': { calories: 86, protein: 3.3, carbs: 19, fat: 1.4, fiber: 2.7, sugar: 6.3, sodium: 15 },

  // Desserts
  'cake': { calories: 347, protein: 4.4, carbs: 57, fat: 12, fiber: 0.4, sugar: 41, sodium: 310 },
  'cookie': { calories: 488, protein: 5.4, carbs: 64, fat: 24, fiber: 2, sugar: 38, sodium: 340 },
  'ice cream': { calories: 207, protein: 3.5, carbs: 24, fat: 11, fiber: 0, sugar: 21, sodium: 80 },
  'chocolate': { calories: 546, protein: 5, carbs: 60, fat: 31, fiber: 7, sugar: 48, sodium: 24 },
  'donut': { calories: 421, protein: 5, carbs: 47, fat: 23, fiber: 1.4, sugar: 23, sodium: 340 },
  'brownie': { calories: 405, protein: 5, carbs: 50, fat: 21, fiber: 2.5, sugar: 35, sodium: 200 },

  // Drinks
  'coffee': { calories: 2, protein: 0.3, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 2 },
  'latte': { calories: 56, protein: 3, carbs: 5.3, fat: 2.4, fiber: 0, sugar: 5.3, sodium: 40 },
  'cappuccino': { calories: 45, protein: 2.5, carbs: 3.6, fat: 2.3, fiber: 0, sugar: 3.6, sodium: 35 },
  'orange juice': { calories: 45, protein: 0.7, carbs: 10, fat: 0.2, fiber: 0.2, sugar: 8.4, sodium: 1 },
  'smoothie': { calories: 68, protein: 1.3, carbs: 14, fat: 0.5, fiber: 1.8, sugar: 10, sodium: 12 },
  'soda': { calories: 41, protein: 0, carbs: 11, fat: 0, fiber: 0, sugar: 11, sodium: 4 },
  'beer': { calories: 43, protein: 0.5, carbs: 3.6, fat: 0, fiber: 0, sugar: 0, sodium: 4 },
  'tea': { calories: 1, protein: 0, carbs: 0.3, fat: 0, fiber: 0, sugar: 0, sodium: 3 },

  // Breakfast
  'pancake': { calories: 227, protein: 6.4, carbs: 29, fat: 10, fiber: 1.3, sugar: 7.2, sodium: 439 },
  'waffle': { calories: 291, protein: 7.9, carbs: 33, fat: 14, fiber: 1, sugar: 6.2, sodium: 511 },
  'cereal': { calories: 379, protein: 7.5, carbs: 84, fat: 1.5, fiber: 5, sugar: 21, sodium: 680 },
  'oatmeal': { calories: 68, protein: 2.4, carbs: 12, fat: 1.4, fiber: 1.7, sugar: 0.5, sodium: 2 },
  'yogurt': { calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0, sugar: 3.6, sodium: 46 },

  // Snacks
  'chips': { calories: 536, protein: 7, carbs: 53, fat: 35, fiber: 3.8, sugar: 0.5, sodium: 530 },
  'popcorn': { calories: 375, protein: 11, carbs: 74, fat: 4.5, fiber: 14, sugar: 0.9, sodium: 8 },
  'nuts': { calories: 607, protein: 20, carbs: 22, fat: 54, fiber: 7, sugar: 4.3, sodium: 3 },
  'peanut butter': { calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 6, sugar: 9, sodium: 459 },
  'granola bar': { calories: 471, protein: 10, carbs: 64, fat: 20, fiber: 6, sugar: 30, sodium: 230 },

  // Cheese & Dairy
  'cheese': { calories: 402, protein: 25, carbs: 1.3, fat: 33, fiber: 0, sugar: 0.5, sodium: 621 },
  'milk': { calories: 42, protein: 3.4, carbs: 5, fat: 1, fiber: 0, sugar: 5, sodium: 44 },
  'butter': { calories: 717, protein: 0.9, carbs: 0.1, fat: 81, fiber: 0, sugar: 0.1, sodium: 643 },
};

@Injectable()
export class NutritionDatabaseService {
  private readonly logger = new Logger(NutritionDatabaseService.name);

  getNutrition(foodName: string, servingSizeGrams: number): NutritionData {
    const key = this.findBestMatch(foodName.toLowerCase());
    const base = NUTRITION_DB[key];

    if (!base) {
      this.logger.warn(`No nutrition data for "${foodName}", using generic estimate`);
      return this.estimateNutrition(foodName, servingSizeGrams);
    }

    const ratio = servingSizeGrams / 100;
    return {
      calories: Math.round(base.calories * ratio),
      protein: Math.round(base.protein * ratio * 10) / 10,
      carbs: Math.round(base.carbs * ratio * 10) / 10,
      fat: Math.round(base.fat * ratio * 10) / 10,
      fiber: Math.round(base.fiber * ratio * 10) / 10,
      sugar: Math.round(base.sugar * ratio * 10) / 10,
      sodium: Math.round(base.sodium * ratio),
    };
  }

  private findBestMatch(input: string): string {
    if (NUTRITION_DB[input]) return input;

    let bestMatch = '';
    let bestScore = 0;

    for (const key of Object.keys(NUTRITION_DB)) {
      const score = this.similarity(input, key);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = key;
      }
    }

    return bestScore > 0.3 ? bestMatch : '';
  }

  private similarity(a: string, b: string): number {
    const wordsA = a.split(/\s+/);
    const wordsB = b.split(/\s+/);
    let matches = 0;
    let total = Math.max(wordsA.length, wordsB.length);

    for (const word of wordsA) {
      if (wordsB.some((w) => w.includes(word) || word.includes(w))) {
        matches++;
      }
    }

    return matches / total;
  }

  private estimateNutrition(foodName: string, grams: number): NutritionData {
    const ratio = grams / 100;
    return {
      calories: Math.round(200 * ratio),
      protein: Math.round(10 * ratio * 10) / 10,
      carbs: Math.round(25 * ratio * 10) / 10,
      fat: Math.round(8 * ratio * 10) / 10,
      fiber: Math.round(2 * ratio * 10) / 10,
      sugar: Math.round(5 * ratio * 10) / 10,
      sodium: Math.round(200 * ratio),
    };
  }
}
