import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { pointsDTO } from 'src/user/dto/points.dto';
import { usersPointsDTO } from 'src/user/dto/usersPoints.dto';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Point } from './point.entity';

const days = [
  'Domingo',
  'Segunda-Feira',
  'Terça-Feira',
  'Quarta-Feira',
  'Quinta-Feira',
  'Sexta-Feira',
  'Sabado',
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
    return point;
  }

  async getTodayLastPoint(userId: number, day: number): Promise<Point> {
    const points = await this.pointRepository
      .createQueryBuilder('Point')
      .where('Point.userId = :userId', { userId: userId })
      .andWhere('Point.day = :day', { day: days[day] })
      .getMany();
    const index = points.length;
    if (index == 0) return points[0];
    return points[index - 1];
  }

  async start(user: User): Promise<Point> {
    const datetime = new Date();
    const today = datetime.getDay();
    const hours = datetime.getHours();
    const minutes = datetime.getMinutes();
    const seconds = datetime.getSeconds();

    if (hours < 10) var hoursAux = '0' + hours.toString();
    else var hoursAux = hours.toString();
    if (minutes < 10) var minutesAux = '0' + minutes.toString();
    else var minutesAux = minutes.toString();
    if (seconds < 10) var secondsAux = '0' + seconds.toString();
    else var secondsAux = seconds.toString();

    const time = `${hoursAux}:${minutesAux}:${secondsAux}`;
    const todaysPoint = await this.getTodayLastPoint(user.id, today);
    if (!todaysPoint) {
      // This means that the user doesn't started any point today
      // Then we create a new one
      const point = new Point();
      point.day = days[today];
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
      todaysPoint.running = true;
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
    const point = await this.getTodayLastPoint(userId, today);
    if (!point || point.time === '00:00:00')
      throw new BadRequestException('Nenhum ponto iniciado');
    // Start => 00:00:00
    // When point was started
    const splitedStart = point.time.split(':');
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

    if (hours < 10) var hoursAux = '0' + hours.toString();
    else var hoursAux = hours.toString();
    if (minutes < 10) var minutesAux = '0' + minutes.toString();
    else var minutesAux = minutes.toString();
    if (seconds < 10) var secondsAux = '0' + seconds.toString();
    else var secondsAux = seconds.toString();

    point.total = `${hoursAux}:${minutesAux}:${secondsAux}`;
    point.time = '00:00:00';
    point.running = false;

    return await (await this.pointRepository.preload(point)).save();
  }

  async perfil(userId: number) {
    const points = await this.pointRepository
      .createQueryBuilder('Points')
      .select('Points.total')
      .where('Points.userId = :userId', { userId: userId })
      .getMany();
    var times = [''];
    times.pop();
    points.forEach((point) => {
      times.push(point.total);
    });
    if (times.length < 5) {
      const size = times.length;
      for (let index = 0; index < 5 - size; index++) {
        times.push('00:00:00');
      }
    }

    var Intsum = [0, 0, 0];
    times.forEach((time) => {
      const splitedTimes = time.split(':');
      const hours = parseInt(splitedTimes[0]);
      const minutes = parseInt(splitedTimes[1]);
      const seconds = parseInt(splitedTimes[2]);
      if (Intsum[2] + seconds >= 60) {
        Intsum[2] = 0;
        Intsum[1] += 1;
      } else Intsum[2] += seconds;

      if (Intsum[1] + minutes >= 60) {
        Intsum[1] = 0;
        Intsum[0] += 1;
      } else Intsum[1] += minutes;
      Intsum[0] += hours;
    });

    var sum = '';

    if (Intsum[0] < 10) var hoursAux = '0' + Intsum[0].toString();
    else var hoursAux = Intsum[0].toString();
    if (Intsum[1] < 10) var minutesAux = '0' + Intsum[1].toString();
    else var minutesAux = Intsum[1].toString();
    if (Intsum[2] < 10) var secondsAux = '0' + Intsum[2].toString();
    else var secondsAux = Intsum[2].toString();

    sum = `${hoursAux}:${minutesAux}:${secondsAux}`;
    const res = new pointsDTO();
    res.sum = sum;
    res.times = times;
    return res;
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
    if (!points || points.length == 0)
      throw new BadRequestException('Nenhum ponto encontrado');
    let ids: number[] = [];
    points.forEach((point) => {
      ids.push(point.id);
    });
    this.pointRepository.delete(ids);
  }
}
