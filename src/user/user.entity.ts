import { Point } from 'src/point/point.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('User')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  celphoneNumber: string;

  @Column()
  role: string;
  /* director, member, master*/

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Point, (point) => point.user)
  points: Point[];
}
