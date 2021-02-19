import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { PointService } from './point.service';
import { PointDTO } from './dto/point.dto';

@Controller('point')
export class PointController {
  constructor(private pointService: PointService) {}

  @Get()
  async get(@Param('id') id: number): Promise<PointDTO[]> {
    return this.pointService.get(id);
  }
  // @Get()
  // @HttpCode(201)
  // async start() {
  //   return this.pointService.add();
  // }
}
