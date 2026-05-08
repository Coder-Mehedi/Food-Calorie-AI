import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Meal } from './meal.entity';

@Entity('meal_items')
export class MealItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  mealId: string;

  @Column()
  foodName: string;

  @Column({ nullable: true })
  quantity: string;

  @Column({ type: 'float' })
  servingSize: number;

  @Column()
  servingUnit: string;

  @Column({ type: 'float' })
  calories: number;

  @Column({ type: 'float' })
  protein: number;

  @Column({ type: 'float' })
  carbs: number;

  @Column({ type: 'float' })
  fat: number;

  @Column({ type: 'float', default: 0 })
  fiber: number;

  @Column({ type: 'float', default: 0 })
  sugar: number;

  @Column({ type: 'float', default: 0 })
  sodium: number;

  @Column({ nullable: true })
  barcode: string;

  @Column({ type: 'float', nullable: true })
  confidence: number;

  @ManyToOne(() => Meal, (meal) => meal.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mealId' })
  meal: Meal;
}
