import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { Point } from './point/point.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '240120',
      database: 'sisPontos',
      entities: [User, Point],
      synchronize: true,
    }),
    UserModule,
  ],
})
export class AppModule {}
