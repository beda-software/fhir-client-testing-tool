import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SessionService } from './session.service';
import { Session } from './session.entity';
import { CreateSessionDto } from './session.dto';

@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  create(@Body() createSessionDto: CreateSessionDto): Promise<Session> {
    return this.sessionService.create(createSessionDto);
  }

  @Get()
  findAll(): Promise<Session[]> {
    return this.sessionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Session> {
    return this.sessionService.findOne(id);
  }
}
