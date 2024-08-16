import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestRun } from './testRun.entity';
import { CreateTestRunDto } from './testRun.dto';

@Injectable()
export class TestRunService {
    constructor(
        @InjectRepository(TestRun)
        private readonly testRunRepository: Repository<TestRun>,
    ) {}

    async create(createRequestDto: CreateTestRunDto): Promise<TestRun> {
        const testRun = this.testRunRepository.create(createRequestDto);
        return this.testRunRepository.save(testRun);
    }

    async findAll(params: any): Promise<TestRun[]> {
        return this.testRunRepository.find(params);
    }

    async findOne(id: string): Promise<TestRun> {
        const testRun = await this.testRunRepository.findOne({ where: { id } });
        if (!testRun) {
            throw new NotFoundException(`Test with ID ${id} not found`);
        }
        return testRun;
    }
}
