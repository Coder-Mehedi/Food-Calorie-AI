import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NutritionLog } from './entities/nutrition-log.entity';
import { Goal } from './entities/goal.entity';
import { CreateGoalDto } from './dto/nutrition.dto';

@Injectable()
export class NutritionService {
  private readonly logger = new Logger(NutritionService.name);

  constructor(
    @InjectRepository(NutritionLog)
    private nutritionLogRepo: Repository<NutritionLog>,
    @InjectRepository(Goal)
    private goalRepo: Repository<Goal>,
  ) {}

  async getNutritionLog(userId: string, date: string): Promise<NutritionLog | null> {
    return this.nutritionLogRepo.findOne({ where: { userId, date: new Date(date) } });
  }

  async upsertNutritionLog(
    userId: string,
    date: string,
    data: Partial<NutritionLog>,
  ): Promise<NutritionLog> {
    let log = await this.getNutritionLog(userId, date);
    if (!log) {
      log = this.nutritionLogRepo.create({ userId, date: new Date(date), ...data });
    } else {
      Object.assign(log, data);
    }
    return this.nutritionLogRepo.save(log);
  }

  async getGoals(userId: string): Promise<Goal[]> {
    return this.goalRepo.find({ where: { userId, isActive: true } });
  }

  async createGoal(userId: string, dto: CreateGoalDto): Promise<Goal> {
    const goal = this.goalRepo.create({ userId, ...dto });
    return this.goalRepo.save(goal);
  }

  async deactivateGoal(goalId: string, userId: string): Promise<void> {
    await this.goalRepo.update({ id: goalId, userId }, { isActive: false });
  }
}
