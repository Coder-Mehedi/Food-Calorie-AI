import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealsService } from './meals.service';
import { Meal } from './entities/meal.entity';
import { MealItem } from './entities/meal-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Meal, MealItem])],
  providers: [MealsService],
  exports: [MealsService],
})
export class MealsModule {}
