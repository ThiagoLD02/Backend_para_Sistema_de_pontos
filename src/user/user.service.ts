import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDTO } from './dto/user.dto';
import { User } from './user.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private user: Repository<User>,
  ) {}

  getAll() {
    const query = this.user;
  }
  getById(id: number) {}
  addUser(userParams: UserDTO) {}
  //   update(task: Task) {}
}
