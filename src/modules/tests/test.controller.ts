import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTestSessionDto } from './test.dto';
import { Response } from 'express';
import { runCLI } from '@jest/core';
import { TestService } from './test.service';
import { SessionService } from '../sessions/session.service';

@ApiTags('tests')
@Controller('tests')
export class TestController {
    constructor(
        private readonly testService: TestService,
        private readonly sessionService: SessionService,
    ) {}

    @Post()
    @ApiOperation({ summary: 'Create a new test session' })
    async create(@Res() res: Response, @Body() createTestSessionDto: CreateTestSessionDto) {
        const { suiteId, sessionId } = createTestSessionDto;
        const testRegex = `/src/suites/${suiteId}/.*\\.(test|spec)\\.[jt]sx?$`;

        const options = {
            rootDir: './',
            testEnvironment: 'node',
            testRegex: testRegex,
            moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
            globals: JSON.stringify({
                SESSION_ID: sessionId,
            }),
            silent: true,
        };

        try {
            const { results } = await runCLI(options as any, [process.cwd()]);
            const currentSession = await this.sessionService.findOne(sessionId);
            const testEntity = await this.testService.create({
                session: currentSession,
                suiteId,
                testResults: results,
            });
            res.status(200).json({ testEntity });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
}
