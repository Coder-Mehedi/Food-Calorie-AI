import {
  Injectable,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import { AiVisionService } from './services/ai-vision.service';
import { NutritionDatabaseService } from './services/nutrition-database.service';
import {
  AnalyzeFoodResponseDto,
  FoodItemResult,
  SaveMealDto,
} from './dto/food-analysis.dto';
import { MealsService } from '../meals/meals.service';

@Injectable()
export class FoodAnalysisService {
  private readonly logger = new Logger(FoodAnalysisService.name);
  private readonly uploadDir: string;

  constructor(
    private aiVision: AiVisionService,
    private nutritionDb: NutritionDatabaseService,
    private mealsService: MealsService,
    private config: ConfigService,
  ) {
    this.uploadDir = this.config.get('UPLOAD_DIR', './uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async analyzeImage(file: Express.Multer.File): Promise<AnalyzeFoodResponseDto> {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    const compressedPath = await this.compressImage(file);
    const imageUrl = `/uploads/${path.basename(compressedPath)}`;

    const detectedFoods = await this.aiVision.detectFoods(compressedPath);

    if (detectedFoods.length === 0) {
      return {
        foods: [],
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        imageUrl,
      };
    }

    const foods: FoodItemResult[] = detectedFoods.map((detected) => {
      const nutrition = this.nutritionDb.getNutrition(
        detected.name,
        detected.servingSize,
      );
      return {
        name: detected.name,
        quantity: detected.quantity,
        servingSize: detected.servingSize,
        servingUnit: detected.servingUnit,
        confidence: detected.confidence,
        ...nutrition,
      };
    });

    const totals = foods.reduce(
      (acc, food) => ({
        totalCalories: acc.totalCalories + food.calories,
        totalProtein: acc.totalProtein + food.protein,
        totalCarbs: acc.totalCarbs + food.carbs,
        totalFat: acc.totalFat + food.fat,
      }),
      { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 },
    );

    return {
      foods,
      imageUrl,
      totalCalories: Math.round(totals.totalCalories),
      totalProtein: Math.round(totals.totalProtein * 10) / 10,
      totalCarbs: Math.round(totals.totalCarbs * 10) / 10,
      totalFat: Math.round(totals.totalFat * 10) / 10,
    };
  }

  async saveMeal(userId: string, dto: SaveMealDto) {
    return this.mealsService.createMeal(userId, dto);
  }

  async getMeals(userId: string, query: any) {
    return this.mealsService.getMeals(userId, query);
  }

  async getDailySummary(userId: string, date: string) {
    return this.mealsService.getDailySummary(userId, date);
  }

  async getWeeklyReport(userId: string, startDate: string) {
    return this.mealsService.getWeeklyReport(userId, startDate);
  }

  private async compressImage(file: Express.Multer.File): Promise<string> {
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
    const outputPath = path.join(this.uploadDir, filename);

    await sharp(file.buffer || fs.readFileSync(file.path))
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(outputPath);

    return outputPath;
  }
}
