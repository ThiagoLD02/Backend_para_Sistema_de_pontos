import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EditDTO } from './dto/edit.dto';
import { LoginDTO } from './dto/login.dto';
import { LoginRespDTO } from './dto/loginResp.dto';
import { PerfilDTO } from './dto/perfil.dto';
import { SearchDTO } from './dto/search.dto';
import { UserDTO } from './dto/user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAll(): Promise<User[]> {
    const user = await this.userRepository
      .createQueryBuilder('Users')
      .orderBy('Users.id', 'ASC')
      .getMany();
    return user;
  }

  async getActives(): Promise<User[]> {
    return await this.userRepository.find({
      where: { isActive: true },
    });
  }

  async getById(id: number): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  async login(body: LoginDTO): Promise<LoginRespDTO> {
    const user = await this.userRepository
      .createQueryBuilder('User')
      .where('User.username = :username', { username: body.username })
      .andWhere('User.password = :password', { password: body.password })
      .getOne();
    if (!user) throw new BadRequestException(`Usuario não encontrado`);
    const data = new LoginRespDTO();
    data.id = user.id;
    user.role === 'director' ? (data.director = true) : (data.director = false);

    return data;
  }

  async perfil(id: number): Promise<PerfilDTO> {
    const user = await this.userRepository.findOne(id);
    if (!user) throw new BadRequestException(`Usuario não encontrado`);

    const data = new PerfilDTO();
    data.username = user.username;
    data.email = user.email;
    data.cellphoneNumber = user.celphoneNumber;

    return data;
  }

  async diretor(id: number): Promise<PerfilDTO> {
    const user = await this.userRepository.findOne(id);
    if (!user) throw new BadRequestException(`Usuario não encontrado`);

    const data = new PerfilDTO();
    data.username = user.username;
    data.email = user.email;
    data.cellphoneNumber = user.celphoneNumber;

    return data;
  }

  async search(): Promise<SearchDTO[]> {
    const users = await this.userRepository
      .createQueryBuilder('User')
      .select('User.id')
      .addSelect('User.username')
      .addSelect('User.email')
      .orderBy('username', 'ASC')
      .getMany();

    return users;
  }

  async cadastro(userParams: UserDTO) {
    if (userParams.role != 'director' && userParams.role != 'member')
      throw new BadRequestException(`Cargo inexistente.`);

    const user = new User();

    user.email = userParams.email;
    user.celphoneNumber = userParams.celphoneNumber;
    user.username = userParams.username;
    user.password = userParams.password;
    user.role = userParams.role;
    this.userRepository.create(user).save();
  }

  async update(body: EditDTO): Promise<User> {
    const user = await this.userRepository.findOne(body.id);
    if (!user) throw new BadRequestException(`Usuario não encontrado`);

    if (body.cellphoneNumber) user.celphoneNumber = body.cellphoneNumber;
    if (body.email) user.email = body.email;
    if (body.password) user.password = body.password;
    // if (body.role) user.role = body.role;
    if (body.username) user.username = body.username;

    return await (await this.userRepository.preload(user)).save();
  }

  async remove(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user) throw new BadRequestException(`Usuario não encontrado`);
    this.userRepository.delete(id);
    return user;
  }
}
