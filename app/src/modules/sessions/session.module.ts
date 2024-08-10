import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './session.entity';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { RequestModule } from '../requests/request.module';

@Module({
  imports: [TypeOrmModule.forFeature([Session]), RequestModule],
  providers: [SessionService],
  controllers: [SessionController],
})
export class SessionModule {}
