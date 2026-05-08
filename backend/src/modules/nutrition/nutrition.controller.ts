import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NutritionService } from './nutrition.service';
import { CreateGoalDto } from './dto/nutrition.dto';

@ApiTags('Nutrition')
@Controller('nutrition')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class NutritionController {
  constructor(private nutritionService: NutritionService) {}

  @Get('daily')
  @ApiOperation({ summary: 'Get nutrition log for a date' })
  getDailyLog(@Request() req: any, @Query('date') date: string) {
    return this.nutritionService.getNutritionLog(req.user.userId, date);
  }

  @Get('goals')
  @ApiOperation({ summary: 'Get active goals' })
  getGoals(@Request() req: any) {
    return this.nutritionService.getGoals(req.user.userId);
  }

  @Post('goals')
  @ApiOperation({ summary: 'Create a new goal' })
  createGoal(@Request() req: any, @Body() dto: CreateGoalDto) {
    return this.nutritionService.createGoal(req.user.userId, dto);
  }

  @Delete('goals/:id')
  @ApiOperation({ summary: 'Deactivate a goal' })
  deactivateGoal(@Request() req: any, @Param('id') id: string) {
    return this.nutritionService.deactivateGoal(id, req.user.userId);
  }
}
