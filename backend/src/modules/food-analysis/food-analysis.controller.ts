import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FoodAnalysisService } from './food-analysis.service';
import { SaveMealDto, AnalyzeFoodResponseDto } from './dto/food-analysis.dto';
import { GetMealsQueryDto } from '../nutrition/dto/nutrition.dto';

@ApiTags('Food Analysis')
@Controller()
export class FoodAnalysisController {
  constructor(private analysisService: FoodAnalysisService) {}

  @Post('analyze-food')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image', { limits: { fileSize: 10 * 1024 * 1024 } }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Analyze food image using AI' })
  async analyzeFood(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ): Promise<AnalyzeFoodResponseDto> {
    return this.analysisService.analyzeImage(file);
  }

  @Post('meals')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Save a meal with food items' })
  async saveMeal(@Request() req: any, @Body() dto: SaveMealDto) {
    return this.analysisService.saveMeal(req.user.userId, dto);
  }

  @Get('meals')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get meal history' })
  async getMeals(@Request() req: any, @Query() query: GetMealsQueryDto) {
    return this.analysisService.getMeals(req.user.userId, query);
  }

  @Get('meals/daily-summary')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get daily nutrition summary' })
  async getDailySummary(
    @Request() req: any,
    @Query('date') date: string,
  ) {
    return this.analysisService.getDailySummary(req.user.userId, date);
  }

  @Get('meals/weekly')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get weekly nutrition report' })
  async getWeeklyReport(
    @Request() req: any,
    @Query('startDate') startDate: string,
  ) {
    return this.analysisService.getWeeklyReport(req.user.userId, startDate);
  }
}
