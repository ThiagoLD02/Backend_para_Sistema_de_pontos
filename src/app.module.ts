import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'thiago',
      password: 'senha',
      database: 'sisPontos',
      entities: [],
      synchronize: true,
    })
    ,UserModule],
  controllers: [AppController, UserController],
  providers: [AppService,UserService],
})
export class AppModule {}
