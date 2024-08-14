import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTestSessionDto } from './test.dto';
import { Request, Response } from 'express';
import { runCLI } from '@jest/core';

@ApiTags('tests')
@Controller('tests')
export class TestController {
    constructor() {}

    @Post()
    @ApiOperation({ summary: 'Create a new test session' })
    async create(@Req() req: Request, @Res() res: Response, @Body() createTestSessionDto: CreateTestSessionDto) {
        // NOTE: WIP
        process.env.SESSION_ID = createTestSessionDto.sessionId;

        const options = {
            rootDir: './',
            testEnvironment: 'node',
            testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
            moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
        };

        try {
            const { results } = await runCLI(options as any, [process.cwd()]);
            res.status(200).json({ results });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
}
