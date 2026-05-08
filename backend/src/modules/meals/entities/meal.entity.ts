import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { MealItem } from './meal-item.entity';

@Entity('meals')
export class Meal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column()
  mealType: string;

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

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  consumedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.meals, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => MealItem, (item) => item.meal, { cascade: true })
  items: MealItem[];
}
