import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PointDTO } from './dto/point.dto';
import { Point } from './point.entity';

@Injectable()
export class PointService {
  constructor(
    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
  ) {}

  async get(id: number): Promise<PointDTO[]> {
    // This is wrong
    const points = await this.pointRepository
      .createQueryBuilder('Points')
      .where('Points.User_id =: id', { id: id })
      .orderBy('Points.id', 'ASC')
      .getMany();

    let data: PointDTO[];
    let item: PointDTO;
    points.map((items) => {
      item.start = items.start;
      item.end = items.end;
      data.push(item);
    });

    return data;
  }

  async start() {
    const datetime = new Date();
    const hours = datetime.getHours();
    const minutes = datetime.getMinutes();
    const seconds = datetime.getSeconds();
    const point = `${hours}:${minutes}:${seconds}`;
    await this.pointRepository.createQueryBuilder('Point').insert;
  }
}
