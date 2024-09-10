import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { SessionService } from './session.service';
import { CreateSessionDto } from './session.dto';
import { RequestService } from '../requests/request.service';
import { SessionWithBaseUrl, SessionWithRequests } from './interfaces';

@ApiTags('sessions')
@Controller('sessions')
export class SessionController {
    constructor(
        private readonly sessionService: SessionService,
        private readonly requestService: RequestService,
    ) {}

    @Post()
    @ApiOperation({ summary: 'Create a new session' })
    async create(@Body() createSessionDto: CreateSessionDto): Promise<SessionWithBaseUrl> {
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
        const sessionEntity = await this.sessionService.create(createSessionDto);

        return { ...sessionEntity, baseUrl: `${backendUrl}/proxy/${sessionEntity.id}` };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Find a session by ID' })
    @ApiParam({ name: 'id', description: 'Session ID' })
    async findOne(@Param('id') id: string): Promise<SessionWithRequests> {
        const currentSession = await this.sessionService.findOne(id);
        const sessionRequests = await this.requestService.findAll({
            where: { session: { id: id } },
            relations: ['session'],
        });
        const requestsLength = sessionRequests.length;

        return { ...currentSession, requestsNumber: requestsLength };
    }
}
