import { Controller, Delete, Get, Param } from '@nestjs/common';
import { PointService } from './point.service';
import { Point } from './point.entity';
// import { User } from 'src/user/user.entity';

@Controller('point')
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @Get(':id')
  async getById(@Param('id') id: number): Promise<Point[]> {
    return this.pointService.getPointsByUserId(id);
  }
  @Get()
  async getAll() {
    return this.pointService.getAll();
  }
  @Get('director')
  async getAllFiltered() {
    return this.pointService.getAllFiltered();
  }
  @Get('perfil/:id')
  async perfil(@Param('id') userId: number) {
    return this.pointService.perfil(userId);
  }
  @Get('end/:id')
  async end(@Param('id') userId: number) {
    return this.pointService.end(userId);
  }
  @Delete(':id')
  async delete(@Param('id') userId: number) {
    return this.pointService.delete(userId);
  }
}
