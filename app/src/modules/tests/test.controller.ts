import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTestSessionDto } from './test.dto';
import { Response } from 'express';
import { runCLI } from '@jest/core';

@ApiTags('tests')
@Controller('tests')
export class TestController {
    constructor() {}

    @Post()
    @ApiOperation({ summary: 'Create a new test session' })
    async create(@Res() res: Response, @Body() createTestSessionDto: CreateTestSessionDto) {
        const options = {
            rootDir: './',
            testEnvironment: 'node',
            // TODO: Fix to work with specific test files
            testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
            moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
            globals: JSON.stringify({
                SESSION_ID: createTestSessionDto.sessionId,
            }),
        };

        try {
            const { results } = await runCLI(options as any, [process.cwd()]);
            res.status(200).json({ results });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
}
