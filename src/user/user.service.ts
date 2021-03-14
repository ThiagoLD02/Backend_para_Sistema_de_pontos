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
import { PointService } from '../point/point.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly pointService: PointService,
  ) {}

  async getAll(): Promise<User[]> {
    const users = await this.userRepository
      .createQueryBuilder('Users')
      .leftJoinAndSelect('Users.points', 'points')
      .orderBy('Users.id', 'ASC')
      .getMany();
    if (!users) throw new BadRequestException('Nenhum usuario encontrado');
    return users;
  }

  async getById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      join: {
        alias: 'Users',
        leftJoinAndSelect: {
          points: 'Users.points',
        },
      },
    });
    if (!user) throw new BadRequestException('Usuario não encontrado');
    return user;
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
    data.phone = user.phone;

    data.points = await this.pointService.getPointsByUserId(user.id);

    return data;
  }

  async start(userId: number) {
    const user = await this.getById(userId);
    return await this.pointService.start(user);
  }

  async diretor(id: number): Promise<PerfilDTO> {
    const user = await this.userRepository.findOne(id);
    if (!user) throw new BadRequestException(`Usuario não encontrado`);

    const data = new PerfilDTO();
    data.username = user.username;
    data.email = user.email;
    data.phone = user.phone;

    return data;
  }

  async search(): Promise<SearchDTO[]> {
    const users = await this.userRepository
      .createQueryBuilder('User')
      .select(['User.id AS value', 'User.username AS label'])
      .getRawMany();

    return users;
  }

  // async membersPoints(){
  //   const usersIds = await this.userRepository
  //   .createQueryBuilder('User')
  //   .select('User.id')
  //   .getMany();
  //   const points = await this.pointService.usersPoints(usersIds);
  // }

  async cadastro(userParams: UserDTO) {
    if (userParams.role != 'director' && userParams.role != 'member')
      throw new BadRequestException(`Cargo inexistente.`);

    const user = new User();
    if (!userParams.email) throw new BadRequestException(`Email invalido`);
    if (!userParams.password) throw new BadRequestException(`Senha invalido.`);
    if (!userParams.phone)
      throw new BadRequestException(`Numerdo de celular invalido.`);
    if (!userParams.username)
      throw new BadRequestException(`Nome de usuario invalido.`);

    user.email = userParams.email;
    user.phone = userParams.phone;
    user.username = userParams.username;
    user.password = userParams.password;
    user.role = userParams.role;
    user.points = [];
    this.userRepository.create(user).save();
  }

  async update(body: EditDTO): Promise<User> {
    const user = await this.userRepository.findOne(body.id);
    if (!user) throw new BadRequestException(`Usuario não encontrado`);

    if (body.phone) user.phone = body.phone;
    if (body.email) user.email = body.email;
    if (body.password) user.password = body.password;
    if (body.username) user.username = body.username;

    return await (await this.userRepository.preload(user)).save();
  }

  async remove(userId: number): Promise<User> {
    const user = await this.userRepository.findOne(userId);
    if (!user) throw new BadRequestException(`Usuario não encontrado`);
    await this.pointService.delete(userId);
    await this.userRepository.delete(userId);
    return user;
  }
}
