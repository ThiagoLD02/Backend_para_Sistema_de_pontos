import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDTO } from './dto/user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  getAll() {
    const query = this.userRepository.find();
    return query;
  }
  getById(id: number) {
    const query = this.userRepository.findByIds([id]);
    return query;
  }
  addUser(userParams: UserDTO) {
    const user = this.userRepository.create(userParams);
    return user;
  }
  //   update(task: Task) {}
}
