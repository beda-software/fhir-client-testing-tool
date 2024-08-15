import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestEntity } from './test.entity';
import { CreateTestEntityDto } from './test.dto';

@Injectable()
export class TestService {
    constructor(
        @InjectRepository(TestEntity)
        private readonly testRepository: Repository<TestEntity>,
    ) {}

    async create(createRequestDto: CreateTestEntityDto): Promise<TestEntity> {
        const testEntity = this.testRepository.create(createRequestDto);
        return this.testRepository.save(testEntity);
    }

    async findAll(params: any): Promise<TestEntity[]> {
        return this.testRepository.find(params);
    }

    async findOne(id: string): Promise<TestEntity> {
        const testEntity = await this.testRepository.findOne({ where: { id } });
        if (!testEntity) {
            throw new NotFoundException(`Test with ID ${id} not found`);
        }
        return testEntity;
    }
}
