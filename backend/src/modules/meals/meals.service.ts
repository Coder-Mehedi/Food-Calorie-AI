import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Meal } from './entities/meal.entity';
import { MealItem } from './entities/meal-item.entity';
import { SaveMealDto } from '../food-analysis/dto/food-analysis.dto';
import { GetMealsQueryDto } from '../nutrition/dto/nutrition.dto';

@Injectable()
export class MealsService {
  private readonly logger = new Logger(MealsService.name);

  constructor(
    @InjectRepository(Meal)
    private mealRepo: Repository<Meal>,
    @InjectRepository(MealItem)
    private mealItemRepo: Repository<MealItem>,
  ) {}

  async createMeal(userId: string, dto: SaveMealDto): Promise<Meal> {
    const mealItems = dto.foods.map((food) =>
      this.mealItemRepo.create({
        foodName: food.foodName,
        quantity: food.quantity,
        servingSize: food.servingSize,
        servingUnit: food.servingUnit,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        fiber: food.fiber || 0,
        sugar: food.sugar || 0,
        confidence: food.confidence || 0,
      }),
    );

    const meal = this.mealRepo.create({
      userId,
      imageUrl: dto.imageUrl,
      mealType: dto.mealType,
      notes: dto.notes,
      totalCalories: mealItems.reduce((sum, i) => sum + i.calories, 0),
      totalProtein: mealItems.reduce((sum, i) => sum + i.protein, 0),
      totalCarbs: mealItems.reduce((sum, i) => sum + i.carbs, 0),
      totalFat: mealItems.reduce((sum, i) => sum + i.fat, 0),
      totalFiber: mealItems.reduce((sum, i) => sum + i.fiber, 0),
      totalSugar: mealItems.reduce((sum, i) => sum + i.sugar, 0),
      items: mealItems,
    });

    return this.mealRepo.save(meal);
  }

  async getMeals(userId: string, query: GetMealsQueryDto) {
    const qb = this.mealRepo
      .createQueryBuilder('meal')
      .leftJoinAndSelect('meal.items', 'items')
      .where('meal.userId = :userId', { userId })
      .orderBy('meal.consumedAt', 'DESC');

    if (query.date) {
      const start = new Date(query.date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(query.date);
      end.setHours(23, 59, 59, 999);
      qb.andWhere('meal.consumedAt BETWEEN :start AND :end', { start, end });
    }

    if (query.startDate && query.endDate) {
      const start = new Date(query.startDate);
      const end = new Date(query.endDate);
      qb.andWhere('meal.consumedAt BETWEEN :start AND :end', { start, end });
    }

    if (query.mealType) {
      qb.andWhere('meal.mealType = :mealType', { mealType: query.mealType });
    }

    const page = query.page || 1;
    const limit = query.limit || 20;
    qb.skip((page - 1) * limit).take(limit);

    const [meals, total] = await qb.getManyAndCount();
    return { meals, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getMealById(userId: string, mealId: string): Promise<Meal> {
    const meal = await this.mealRepo.findOne({
      where: { id: mealId, userId },
      relations: ['items'],
    });
    if (!meal) throw new NotFoundException('Meal not found');
    return meal;
  }

  async deleteMeal(userId: string, mealId: string): Promise<void> {
    const meal = await this.getMealById(userId, mealId);
    await this.mealRepo.remove(meal);
  }

  async getDailySummary(userId: string, date: string) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const meals = await this.mealRepo.find({
      where: { userId, consumedAt: Between(start, end) },
      relations: ['items'],
    });

    return {
      date,
      mealCount: meals.length,
      meals,
      totals: {
        calories: meals.reduce((s, m) => s + m.totalCalories, 0),
        protein: meals.reduce((s, m) => s + m.totalProtein, 0),
        carbs: meals.reduce((s, m) => s + m.totalCarbs, 0),
        fat: meals.reduce((s, m) => s + m.totalFat, 0),
        fiber: meals.reduce((s, m) => s + m.totalFiber, 0),
        sugar: meals.reduce((s, m) => s + m.totalSugar, 0),
      },
    };
  }

  async getWeeklyReport(userId: string, startDate: string) {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    const meals = await this.mealRepo.find({
      where: {
        userId,
        consumedAt: Between(start, end),
      },
    });

    const dailyData = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(day.getDate() + i);
      const dayStr = day.toISOString().split('T')[0];

      const dayMeals = meals.filter((m) => {
        const mealDate = new Date(m.consumedAt).toISOString().split('T')[0];
        return mealDate === dayStr;
      });

      dailyData.push({
        date: dayStr,
        calories: dayMeals.reduce((s, m) => s + m.totalCalories, 0),
        protein: dayMeals.reduce((s, m) => s + m.totalProtein, 0),
        carbs: dayMeals.reduce((s, m) => s + m.totalCarbs, 0),
        fat: dayMeals.reduce((s, m) => s + m.totalFat, 0),
        mealCount: dayMeals.length,
      });
    }

    return {
      startDate,
      endDate: end.toISOString().split('T')[0],
      dailyData,
      weeklyTotals: {
        calories: dailyData.reduce((s, d) => s + d.calories, 0),
        protein: dailyData.reduce((s, d) => s + d.protein, 0),
        carbs: dailyData.reduce((s, d) => s + d.carbs, 0),
        fat: dailyData.reduce((s, d) => s + d.fat, 0),
        avgDailyCalories: Math.round(
          dailyData.reduce((s, d) => s + d.calories, 0) / 7,
        ),
      },
    };
  }
}
