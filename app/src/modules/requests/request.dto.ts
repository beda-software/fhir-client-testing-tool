import { ApiProperty } from '@nestjs/swagger';
import { Request as RequestType, Response } from 'express';
import { Session } from '../sessions/session.entity';
import { jsonbType } from 'src/utils/types';

export class CreateRequestDto {
    @ApiProperty({ description: 'Session associated with the request' })
    session: Session;

    @ApiProperty({ description: 'HTTP method of the request' })
    requestMethod: RequestType['method'];

    @ApiProperty({ description: 'FHIR action being performed' })
    fhirAction: string;

    @ApiProperty({ description: 'URI of the request' })
    requestUri: string;

    @ApiProperty({ description: 'Remote address of the client' })
    remoteAddr: string;

    @ApiProperty({ description: 'User agent of the client' })
    userAgent: string;

    @ApiProperty({ description: 'Headers of the request' })
    headers: jsonbType;

    @ApiProperty({ description: 'Data payload of the request' })
    data: string;

    @ApiProperty({ description: 'Type of FHIR resource' })
    resourceType: string;

    @ApiProperty({ description: 'Offset for pagination' })
    offset: string;

    @ApiProperty({ description: 'Count for pagination' })
    count: string;

    @ApiProperty({ description: 'Fields to be included in the response' })
    fields: string;

    @ApiProperty({ description: 'Total number of resources' })
    total: string;

    @ApiProperty({ description: 'Summary of the request' })
    summary: string;

    @ApiProperty({ description: 'Format of the response' })
    format: string;

    @ApiProperty({ description: 'Resources to include in the response' })
    include: string;

    @ApiProperty({ description: 'Reverse includes for the response' })
    revInclude: string;

    @ApiProperty({ description: 'Sorting rules for the response' })
    sortRules: string;

    @ApiProperty({ description: 'Filters applied to the request' })
    filters: jsonbType;

    @ApiProperty({ description: 'HTTP status code of the response' })
    status: Response['statusCode'];

    @ApiProperty({ description: 'Data payload of the response', type: Object })
    responseBody: jsonbType;
}
