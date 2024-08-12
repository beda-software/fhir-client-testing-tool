import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { RequestService } from './request.service';
import { Request } from './request.entity';
import { CreateRequestDto } from './request.dto';

@ApiTags('requests')
@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new request' })
  @ApiBody({ type: CreateRequestDto })
  create(@Body() createRequestDto: CreateRequestDto): Promise<Request> {
    return this.requestService.create(createRequestDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all requests' })
  @ApiQuery({ name: 'session', description: 'Session ID', required: false })
  findAll(@Query('session') session: string): Promise<Request[]> {
    return this.requestService.findAll({
      where: { session: { id: session } },
      relations: ['session'],
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a request by ID' })
  @ApiParam({ name: 'id', description: 'Request ID' })
  findOne(@Param('id') id: string): Promise<Request> {
    return this.requestService.findOne(id);
  }
}
