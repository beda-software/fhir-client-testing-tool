import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestEntity } from './test.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestService } from './test.service';
import { SessionModule } from '../sessions/session.module';

@Module({
    imports: [TypeOrmModule.forFeature([TestEntity]), SessionModule],
    controllers: [TestController],
    providers: [TestService],
})
export class TestModule {}
