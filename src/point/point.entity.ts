import { User } from 'src/user/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Pontos')
export class Point extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'time without time zone' })
  start: string;

  @Column({ type: 'time without time zone' })
  end: string;

  @ManyToOne(() => User, (user) => user.points)
  user: User;
}
