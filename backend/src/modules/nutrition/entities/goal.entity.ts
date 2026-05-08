import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('goals')
export class Goal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  type: string;

  @Column({ type: 'float' })
  targetCalories: number;

  @Column({ type: 'float', nullable: true })
  targetProtein: number;

  @Column({ type: 'float', nullable: true })
  targetCarbs: number;

  @Column({ type: 'float', nullable: true })
  targetFat: number;

  @Column({ type: 'float', nullable: true })
  targetWeight: number;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
