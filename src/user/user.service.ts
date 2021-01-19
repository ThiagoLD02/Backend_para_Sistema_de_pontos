import { Injectable } from '@nestjs/common';
import { Task } from '../data/task';
import { userDto } from './dto/user.dto';

@Injectable()
export class UserService {
  tasks: Task[] = [
    { id: 1, user: 'Thiago', password: 'senha', role: 'master' },
  ];
  lastId: number = 1;
  getAll() {
    return this.tasks;
  }
  getById(id: number) {
    const task: Task = this.tasks.find((value: Task) => {
      value.id == id;
    });

    return task;
  }
  addUser(userParams: userDto) {
    const user: Task = {
      id: ++this.lastId,
      password: userParams.password,
      role: userParams.role,
      user: userParams.user,
    };
    this.tasks.push(user);

    return user;
  }
  //   update(task: Task) {}
}
