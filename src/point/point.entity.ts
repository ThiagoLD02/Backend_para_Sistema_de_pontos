import { User } from 'src/user/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Pontos')
export class Point extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  time: string;

  @Column()
  total: string;

  @Column()
  day: string;

  @Column({ default: false })
  running: boolean;

  @ManyToOne(() => User, (user) => user.points)
  @JoinColumn({ name: 'userId' })
  user: User;
}
