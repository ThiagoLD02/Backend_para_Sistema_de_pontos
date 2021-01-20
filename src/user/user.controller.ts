import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAll(): Promise<string> {
    return this.userService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: number): Promise<string> {
    return this.userService.getById(id);
  }

  @Post()
  async addUser(@Body() body: UserDTO): Promise<string> {
    return this.userService.addUser(body);
  }
}
