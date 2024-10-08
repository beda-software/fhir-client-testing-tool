import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { InitiateTestRunDto } from './testRun.dto';
import { Response } from 'express';
import { runCLI } from '@jest/core';
import { TestRunService } from './testRun.service';
import { SessionService } from '../sessions/session.service';
import { TestRun } from './testRun.entity';
import { createTestListObject } from '../../utils/data';

const testOptions = {
    globalSetup: './app/src/utils/setup/jest.setup.ts',
    globalTeardown: './app/src/utils/setup/jest.teardown.ts',
    rootDir: '../',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    maxWorkers: 1,
};

@ApiTags('test-runs')
@Controller('test-runs')
export class TestRunController {
    requestService: any;
    constructor(
        private readonly testRunService: TestRunService,
        private readonly sessionService: SessionService,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create a new test session' })
    async create(@Res() res: Response, @Body() createTestSessionDto: InitiateTestRunDto) {
        const { suiteId, sessionId, testId } = createTestSessionDto;
        // const testRegex = `/src/suites/${suiteId}/.*\\.(test|spec)\\.[jt]sx?$`;
        const testRegex = `./${suiteId}/src/.*\\.spec\\.ts$`;
        const optionsWithTest = testId ? { testNamePattern: testId } : {};

        const currentSession = await this.sessionService.findOne(sessionId);
        const testRun = await this.testRunService.create({
            session: currentSession,
            suiteId: testId ? testId : suiteId,
        });

        const options = {
            ...testOptions,
            ...{
                testRegex: testRegex,
                globals: JSON.stringify({
                    SESSION_ID: sessionId,
                }),
                reporters: [
                    'default',
                    [
                        '<rootDir>/app/src/custom-reporter.js',
                        {
                            TEST_RUN_ID: testRun.id,
                            TEST_RUN_SERVICE: this.testRunService,
                        },
                    ],
                ],
            },
            ...optionsWithTest,
        };

        try {
            const { results } = await runCLI(options as any, [process.cwd()]);
            const testRunAfterTests = await this.testRunService.findOne(testRun.id);
            const finalTestRun = await this.testRunService.update({
                ...testRunAfterTests,
                ...{ testResults: results },
            });
            res.status(200).json({ finalTestRun });
        } catch (error) {
            const failedTestRun = await this.testRunService.findOne(testRun.id);
            await this.testRunService.update({
                ...failedTestRun,
                ...{ status: 'failed' },
            });
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }

    @Get('test-list')
    @ApiOperation({ summary: 'List all tests' })
    async list(@Res() res: Response) {
        const testRegex = `test-suites-.*/.*\\.(test|spec)\\.[jt]sx?$`;

        const options = {
            ...testOptions,
            ...{
                testRegex: testRegex,
                testList: true,
                testPathIgnorePatterns: ['/node_modules/', '/dist/']
            },
        };

        try {
            const results = await runCLI(options as any, [process.cwd()]);
            res.status(200).json({ suites: createTestListObject(results) });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Find a test run by ID' })
    @ApiParam({ name: 'id', description: 'Test run ID' })
    findOne(@Param('id') id: string): Promise<TestRun> {
        return this.testRunService.findOne(id);
    }

    @Get(':id/report')
    @ApiOperation({ summary: 'Find a test run by ID' })
    @ApiParam({ name: 'id', description: 'Test run ID' })
    async getReport(@Param('id') id: string) {
        const testRun = await this.testRunService.findOne(id);
        return testRun.testResults;
    }

    @Get(':id/report/download')
    @ApiOperation({ summary: 'Find a test run by ID' })
    @ApiParam({ name: 'id', description: 'Test run ID' })
    async downloadReportFile(@Param('id') id: string, @Res() res: Response) {
        const testRun = await this.testRunService.findOne(id);
        const testResults = testRun.testResults;

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${testRun.id}.json"`);
        res.send(testResults);
    }
}
