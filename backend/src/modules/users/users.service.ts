import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async getProfile(userId: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const { password, ...result } = user;
    return result as User;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, dto);
    await this.userRepo.save(user);

    const { password, ...result } = user;
    return result as User;
  }

  async getDailyTarget(userId: string): Promise<number> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (user.dailyCalorieTarget) return user.dailyCalorieTarget;

    // Harris-Benedict equation estimate
    let bmr: number;
    if (user.gender === 'male') {
      bmr = 88.362 + 13.397 * (user.weight || 70) + 4.799 * (user.height || 170) * 100 - 5.677 * (user.age || 30);
    } else {
      bmr = 447.593 + 9.247 * (user.weight || 60) + 3.098 * (user.height || 160) * 100 - 4.330 * (user.age || 30);
    }

    const activityMultiplier = 1.55;
    return Math.round(bmr * activityMultiplier);
  }
}
