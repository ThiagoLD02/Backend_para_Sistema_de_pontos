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

  async getAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getActives(): Promise<User[]> {
    return await this.userRepository.find({
      where: { isActive: true },
    });
  }

  async getById(id: number): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  async create(userParams: UserDTO): Promise<User> {
    const user = new User();
    user.celphoneNumber = userParams.celphoneNumber;
    user.email = userParams.email;
    user.password = userParams.password;
    user.role = userParams.role;
    user.username = userParams.username;

    return await this.userRepository.create(user).save();
  }
  async update(id: number, body: UserDTO): Promise<User> {
    const user = await this.userRepository.findOne(id);

    if (body.celphoneNumber) user.celphoneNumber = body.celphoneNumber;
    if (body.email) user.email = body.email;
    if (body.password) user.password = body.password;
    if (body.role) user.role = body.role;
    if (body.username) user.username = body.username;

    return await (await this.userRepository.preload(user)).save();
  }

  async remove(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id);
    user.isActive = false;
    return await (await this.userRepository.preload(user)).save();
  }
}
