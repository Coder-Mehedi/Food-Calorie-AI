import { IsString, IsOptional, IsEnum, IsArray, IsNumber, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AnalyzeFoodDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(['breakfast', 'lunch', 'dinner', 'snack'])
  mealType?: string;
}

export class FoodItemResult {
  name: string;
  quantity: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  confidence: number;
}

export class AnalyzeFoodResponseDto {
  @ApiProperty()
  foods: FoodItemResult[];

  @ApiProperty()
  totalCalories: number;

  @ApiProperty()
  totalProtein: number;

  @ApiProperty()
  totalCarbs: number;

  @ApiProperty()
  totalFat: number;

  @ApiProperty()
  imageUrl: string;
}

export class SaveMealDto {
  @ApiProperty()
  @IsString()
  imageUrl: string;

  @ApiProperty()
  @IsString()
  mealType: string;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaveMealItemDto)
  foods: SaveMealItemDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class SaveMealItemDto {
  @IsString()
  foodName: string;

  @IsString()
  quantity: string;

  @IsNumber()
  servingSize: number;

  @IsString()
  servingUnit: string;

  @IsNumber()
  calories: number;

  @IsNumber()
  protein: number;

  @IsNumber()
  carbs: number;

  @IsNumber()
  fat: number;

  @IsOptional()
  @IsNumber()
  fiber?: number;

  @IsOptional()
  @IsNumber()
  sugar?: number;

  @IsOptional()
  @IsNumber()
  confidence?: number;
}
