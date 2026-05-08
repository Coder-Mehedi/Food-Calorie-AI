import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NutritionService } from './nutrition.service';
import { NutritionController } from './nutrition.controller';
import { NutritionLog } from './entities/nutrition-log.entity';
import { Goal } from './entities/goal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NutritionLog, Goal])],
  providers: [NutritionService],
  controllers: [NutritionController],
  exports: [NutritionService],
})
export class NutritionModule {}
