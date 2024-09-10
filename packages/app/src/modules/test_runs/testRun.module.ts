import { Module } from '@nestjs/common';
import { TestRunController } from './testRun.controller';
import { TestRun } from './testRun.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestRunService } from './testRun.service';
import { SessionModule } from '../sessions/session.module';

@Module({
    imports: [TypeOrmModule.forFeature([TestRun]), SessionModule],
    controllers: [TestRunController],
    providers: [TestRunService],
})
export class TestRunModule {}
