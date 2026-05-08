import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('nutrition_logs')
export class NutritionLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ type: 'date' })
  @Index()
  date: Date;

  @Column({ type: 'float', default: 0 })
  totalCalories: number;

  @Column({ type: 'float', default: 0 })
  totalProtein: number;

  @Column({ type: 'float', default: 0 })
  totalCarbs: number;

  @Column({ type: 'float', default: 0 })
  totalFat: number;

  @Column({ type: 'float', default: 0 })
  totalFiber: number;

  @Column({ type: 'float', default: 0 })
  totalSugar: number;

  @Column({ type: 'int', default: 0 })
  mealCount: number;

  @Column({ type: 'float', default: 0 })
  calorieTarget: number;

  @Column({ type: 'float', default: 0 })
  waterIntake: number;

  @CreateDateColumn()
  createdAt: Date;
}
