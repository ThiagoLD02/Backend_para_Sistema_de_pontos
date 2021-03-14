import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { Point } from './point/point.entity';
import { PointModule } from './point/point.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'senha',
      database: 'sisPontos',
      entities: [User, Point],
      synchronize: true,
    }),
    UserModule,
    PointModule,
  ],
})
export class AppModule {}
