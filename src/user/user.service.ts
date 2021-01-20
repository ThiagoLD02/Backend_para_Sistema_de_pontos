import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDTO } from './dto/user.dto';
import { User } from './user.entity';
@Injectable()
export class UserService {
  getAll() {
    return 'Este metodo retorna todos os usuarios';
  }
  getById(id: number) {
    return `Este metodo retorna um usuario com este id: ${id} `;
  }
  addUser(userParams: UserDTO) {
    return `Este metodo cria um novo usuario, seus dados são
    ${userParams.celphoneNumber},
    ${userParams.email},
    ${userParams.id},
    ${userParams.password},
    ${userParams.role},
    ${userParams.username}.
    
    `;
  }
  //   update(task: Task) {}
}
