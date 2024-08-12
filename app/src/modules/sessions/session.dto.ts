import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty({
    example: 'https://au-core.beda.software/fhir',
    description: 'The target URL for the session',
    type: String,
  })
  target: string;
}
