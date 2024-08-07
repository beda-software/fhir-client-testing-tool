import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from './response.entity';
import { CreateResponseDto } from './response.dto';

@Injectable()
export class ResponseService {
  constructor(
    @InjectRepository(Response)
    private readonly responseRepository: Repository<Response>,
  ) {}

  async create(createRequestDto: CreateResponseDto): Promise<Response> {
    const response = this.responseRepository.create(createRequestDto);
    return this.responseRepository.save(response);
  }

  async findAll(): Promise<Response[]> {
    return this.responseRepository.find();
  }

  async findOne(id: number): Promise<Response> {
    const response = await this.responseRepository.findOne({ where: { id } });
    if (!response) {
      throw new NotFoundException(`Response with ID ${id} not found`);
    }
    return response;
  }
}
