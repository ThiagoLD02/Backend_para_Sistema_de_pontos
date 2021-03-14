import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { PointController } from './point.controller';
import { Point } from './point.entity';
import { PointService } from './point.service';

// forwardRef(() => UserModule)

@Module({
  imports: [TypeOrmModule.forFeature([Point])],
  providers: [PointService],
  controllers: [PointController],
  exports: [PointService],
})
export class PointModule {}
