import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ResponseService } from './response.service';
import { CreateResponseDto } from './response.dto';
import { Response } from './response.entity';

@Controller('responses')
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}

  @Post()
  create(@Body() createResponseDto: CreateResponseDto): Promise<Response> {
    return this.responseService.create(createResponseDto);
  }

  @Get()
  findAll(): Promise<Response[]> {
    return this.responseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Response> {
    return this.responseService.findOne(id);
  }
}
