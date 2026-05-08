import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  age?: number;

  @ApiProperty({ required: false, enum: ['male', 'female', 'other'] })
  @IsOptional()
  @IsEnum(['male', 'female', 'other'])
  gender?: string;

  @ApiProperty({ required: false, enum: ['lose_weight', 'maintain', 'gain_muscle', 'improve_health'] })
  @IsOptional()
  @IsString()
  fitnessGoal?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  dailyCalorieTarget?: number;
}
