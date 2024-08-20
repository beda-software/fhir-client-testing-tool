import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InitiateTestRunDto } from './testRun.dto';
import { Response } from 'express';
import { runCLI } from '@jest/core';
import { TestRunService } from './testRun.service';
import { SessionService } from '../sessions/session.service';

@ApiTags('test-runs')
@Controller('test-runs')
export class TestRunController {
    constructor(
        private readonly testRunService: TestRunService,
        private readonly sessionService: SessionService,
    ) {}

    @Post()
    @ApiOperation({ summary: 'Create a new test session' })
    async create(@Res() res: Response, @Body() createTestSessionDto: InitiateTestRunDto) {
        const { suiteId, sessionId } = createTestSessionDto;
        const testRegex = `/src/suites/${suiteId}/.*\\.(test|spec)\\.[jt]sx?$`;

        const options = {
            globalSetup: './src/utils/setup/jest.setup.ts',
            globalTeardown: './src/utils/setup/jest.teardown.ts',
            rootDir: './',
            testEnvironment: 'node',
            testRegex: testRegex,
            moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
            globals: JSON.stringify({
                SESSION_ID: sessionId,
            }),
            // silent: true,
        };

        try {
            const { results } = await runCLI(options as any, [process.cwd()]);
            const currentSession = await this.sessionService.findOne(sessionId);
            const testRun = await this.testRunService.create({
                session: currentSession,
                suiteId,
                testResults: results,
            });
            res.status(200).json({ testRun });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
}
