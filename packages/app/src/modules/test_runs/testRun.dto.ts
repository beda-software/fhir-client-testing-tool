import { ApiProperty } from '@nestjs/swagger';
import { json } from 'node:stream/consumers';
import { jsonbType } from '../../utils/types';
import { Session } from '../sessions/session.entity';

export class CreateTestRunDto {
    @ApiProperty({
        example: '97049c1b-0ac3-4b3f-9e9a-fcc8b1709563',
        description: 'Run tests for the session',
        type: String,
    })
    session: Session;

    @ApiProperty({
        example: '1.0.0-ballot',
        description: 'Run specific test suite',
        type: String,
    })
    suiteId: string;

    @ApiProperty({
        description: 'Run specific test suite',
        type: json,
    })
    testResults?: jsonbType;
}

export class InitiateTestRunDto {
    @ApiProperty({
        example: '97049c1b-0ac3-4b3f-9e9a-fcc8b1709563',
        description: 'Run tests for the session',
        type: String,
    })
    sessionId: string;

    @ApiProperty({
        example: '1.0.0-ballot',
        description: 'Run specific test suite',
        type: String,
    })
    suiteId: string;

    @ApiProperty({
        example: 'Patients test Should only have available interactions',
        description: 'Run specific test',
        type: String,
    })
    testId: string;
}
