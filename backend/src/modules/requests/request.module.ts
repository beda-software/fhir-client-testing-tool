import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from 'src/entity/Request';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Request])],
  providers: [RequestService],
  controllers: [RequestController],
})
export class RequestModule {}
