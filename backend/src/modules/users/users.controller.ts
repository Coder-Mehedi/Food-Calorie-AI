import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/user.dto';

@ApiTags('Users')
@Controller('profile')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get user profile' })
  getProfile(@Request() req: any) {
    return this.usersService.getProfile(req.user.userId);
  }

  @Put()
  @ApiOperation({ summary: 'Update user profile' })
  updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.userId, dto);
  }

  @Get('calorie-target')
  @ApiOperation({ summary: 'Get calculated daily calorie target based on BMR' })
  getCalorieTarget(@Request() req: any) {
    return this.usersService.getDailyTarget(req.user.userId);
  }
}
