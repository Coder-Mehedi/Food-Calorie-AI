import { Module } from '@nestjs/common';
import { FoodAnalysisController } from './food-analysis.controller';
import { FoodAnalysisService } from './food-analysis.service';
import { AiVisionService } from './services/ai-vision.service';
import { NutritionDatabaseService } from './services/nutrition-database.service';
import { MealsModule } from '../meals/meals.module';

@Module({
  imports: [MealsModule],
  controllers: [FoodAnalysisController],
  providers: [FoodAnalysisService, AiVisionService, NutritionDatabaseService],
  exports: [FoodAnalysisService],
})
export class FoodAnalysisModule {}
