import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Response } from './response.entity';
import { ResponseService } from './response.service';
import { ResponseController } from './response.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Response])],
  providers: [ResponseService],
  controllers: [ResponseController],
  exports: [ResponseService],
})
export class ResponseModule {}
