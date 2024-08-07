import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SessionService } from './session.service';
import { Session } from './session.entity';
import { CreateSessionDto } from './session.dto';
import { parseSearchRequest } from '@medplum/core';

@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  create(@Body() createSessionDto: CreateSessionDto): Promise<Session> {
    return this.sessionService.create(createSessionDto);
  }

  @Get()
  findAll(): Promise<Session[]> {
    console.log(
      JSON.stringify(
        parseSearchRequest(
          'https://au-core.beda.software/fhir/Patient?gender=female&_sort=name&_offset=0&_count=20&_elements=name,birthdate&_total=accurate&_include=Patient:general-practitioner&_revinclude=Observation:subject&_summary=data&_format=json',
        ),
        undefined,
        2,
      ),
    );
    return this.sessionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Session> {
    return this.sessionService.findOne(id);
  }
}
