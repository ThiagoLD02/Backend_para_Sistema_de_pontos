import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { Task } from 'src/data/task';
import { userDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(
        private userService: UserService
    ) { }

    @Get()
    async getAll() : Promise<Task[]> {
        return this.userService.getAll();
    }

    @Get(':id')
    async getById(@Param('id') id:number )  : Promise<Task> {
        return this.userService.getById(id);
    }

    @Post()
    async addUser(@Body() body:userDto) : Promise<Task> {
        return this.userService.addUser(body);
    }

}
