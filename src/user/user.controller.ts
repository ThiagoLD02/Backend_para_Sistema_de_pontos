import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
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
  @Get('/active')
  async getActives(): Promise<User[]> {
    return this.userService.getActives();
  }

  @Get(':id')
  async getById(@Param('id') id: number): Promise<User> {
    return this.userService.getById(id);
  }

  @Post()
  async addUser(@Body() body: UserDTO): Promise<User> {
    return this.userService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() body: UserDTO): Promise<User> {
    return this.userService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<User> {
    return this.userService.remove(id);
  }
}
