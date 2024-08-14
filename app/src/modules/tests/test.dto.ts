import { ApiProperty } from '@nestjs/swagger';

export class CreateTestSessionDto {
    @ApiProperty({
        example: '97049c1b-0ac3-4b3f-9e9a-fcc8b1709563',
        description: 'Run tests for the session',
        type: String,
    })
    sessionId: string;
}
