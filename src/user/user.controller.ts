import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Redirect,
} from '@nestjs/common';
import { Point } from 'src/point/point.entity';
import { DiretorDTO } from './dto/diretor.dto';
import { EditDTO } from './dto/edit.dto';
import { LoginDTO } from './dto/login.dto';
import { LoginRespDTO } from './dto/loginResp.dto';
import { PerfilDTO } from './dto/perfil.dto';
import { SearchDTO } from './dto/search.dto';
import { UserDTO } from './dto/user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Get('/search')
  async search(): Promise<SearchDTO[]> {
    return this.userService.search();
  }

  @Get(':id')
  async getById(@Param('id') id: number): Promise<User> {
    return this.userService.getById(id);
  }

  @Get('/start/:id')
  async start(@Param('id') id: number): Promise<Point> {
    return this.userService.start(id);
  }

  @Get('/perfil/:id')
  async perfil(@Param('id') id: number) {
    return this.userService.perfil(id);
  }

  @Get('/diretor/:id')
  async diretor(@Param('id') id: number): Promise<DiretorDTO> {
    return this.userService.diretor(id);
  }

  // @Get()
  // async membersPoints(){
  //   return this.userService.membersPoints();
  // }

  @HttpCode(200)
  @HttpCode(404)
  @Post('/login')
  async login(@Body() body: LoginDTO): Promise<LoginRespDTO> {
    return this.userService.login(body);
  }

  @Post('/cadastro')
  async cadastro(@Body() body: UserDTO) {
    return this.userService.cadastro(body);
  }

  @Put()
  async update(@Body() body: EditDTO): Promise<User> {
    return this.userService.update(body);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<User> {
    return this.userService.remove(id);
  }

  @Delete()
  async deleteAllUsersPoints() {
    return this.userService.deleteAllUsersPoints();
  }
}
