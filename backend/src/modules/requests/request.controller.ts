import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { RequestService } from './request.service';
import { Request } from './request.entity';
import { CreateRequestDto } from './request.dto';

@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  create(@Body() createUserDto: CreateRequestDto): Promise<Request> {
    return this.requestService.create(createUserDto);
  }

  @Get()
  findAll(): Promise<Request[]> {
    return this.requestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Request> {
    return this.requestService.findOne(id);
  }
}