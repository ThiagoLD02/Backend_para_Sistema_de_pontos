import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Point } from './point.entity';

const days = [
  'Segunda-Feira',
  'Terça-Feira',
  'Quarta-Feira',
  'Quinta-Feira',
  'Sexta-Feira',
  'Sabado',
  'Domingo',
];

@Injectable()
export class PointService {
  constructor(
    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,
  ) {}

  async getAll(): Promise<Point[]> {
    const points = await this.pointRepository
      .createQueryBuilder('Point')
      .orderBy('Point.id', 'ASC')
      .getMany();
    if (!points) throw new BadRequestException('Nenhum ponto encontrado');
    return points;
  }

  async getPointsByUserId(userId: number): Promise<Point[]> {
    const point = await this.pointRepository
      .createQueryBuilder('Point')
      .where('Point.userId = :userId', { userId: userId })
      .getMany();
    if (!point || point.length == 0)
      throw new BadRequestException('Nenhum ponto encontrado');
    return point;
  }

  async getTodayLastPoint(userId: number, day: number): Promise<Point> {
    const points = await this.pointRepository
      .createQueryBuilder('Point')
      .where('Point.userId = :userId', { userId: userId })
      .andWhere('Point.day = :day', { day: days[day - 1] })
      .getMany();
    const index = points.length;
    return points[index - 1];
  }

  async start(user: User): Promise<Point> {
    const datetime = new Date();
    const today = datetime.getDay();
    const hours = datetime.getHours();
    const minutes = datetime.getMinutes();
    const seconds = datetime.getSeconds();
    const time = `${hours}:${minutes}:${seconds}`;
    const todaysPoint = await this.getTodayLastPoint(user.id, today);
    if (!todaysPoint) {
      // This means that the user doesn't started any point today
      // Then we create a new one
      const point = new Point();
      point.day = days[today - 1];
      point.time = time;
      point.user = user;
      point.total = '00:00:00';
      point.running = true;
      const newPoint = await this.pointRepository.create(point).save();
      return newPoint;
    } else {
      // In this case he already started at least one point
      if (todaysPoint.running === true)
        throw new BadRequestException('Existe um ponto não finalizado');
      todaysPoint.time = time;
      (await this.pointRepository.preload(todaysPoint)).save();
      return todaysPoint;
    }
  }

  async end(userId: number) {
    // Now
    const datetime = new Date();
    const today = datetime.getDay();
    const endHours = datetime.getHours();
    const endMinutes = datetime.getMinutes();
    const endSeconds = datetime.getSeconds();
    console.log([endHours, endMinutes, endSeconds], 'Fim');
    const point = await this.getTodayLastPoint(userId, today);
    if (!point || point.time === '00:00:00')
      throw new BadRequestException('Nenhum ponto iniciado');
    // Start => 00:00:00
    // When point was started
    const splitedStart = point.time.split(':');
    console.log(splitedStart, 'Inicio');
    let startHours = parseInt(splitedStart[0]);
    let startMinutes = parseInt(splitedStart[1]);
    let startSeconds = parseInt(splitedStart[2]);

    // For the final answer
    let seconds = 0,
      minutes = 0,
      hours = 0;
    if (endSeconds < startSeconds) {
      seconds = 60 + endSeconds - startSeconds;
      startMinutes -= 1;
    } else {
      seconds = endSeconds - startSeconds;
    }
    if (endMinutes < startMinutes) {
      minutes = 60 + endMinutes - startMinutes;
      startMinutes -= 1;
    } else {
      minutes = endMinutes - startMinutes;
    }

    hours = endHours - startHours;

    point.total = `${hours}:${minutes}:${seconds}`;
    point.time = '00:00:00';
    point.running = false;
    console.log([hours, minutes, seconds], 'Resultado');

    return await (await this.pointRepository.preload(point)).save();
  }

  async perfil(userId: number) {
    const times = await this.pointRepository
      .createQueryBuilder('Points')
      .select('Points.total')
      .where('Points.userId = :userId', { userId: userId })
      .getMany();
    return times;
  }

  async getAllFiltered(): Promise<Point[]> {
    const points = await this.pointRepository
      .createQueryBuilder('Point')
      .select('Point.total')
      .groupBy('Point.userId')
      .getMany();
    if (!points) throw new BadRequestException('Nenhum ponto encontrado');
    return points;
  }

  async delete(userId: number) {
    const points = await this.getPointsByUserId(userId);
    let ids: number[] = [];
    points.forEach((point) => {
      ids.push(point.id);
    });
    this.pointRepository.delete(ids);
  }
}
