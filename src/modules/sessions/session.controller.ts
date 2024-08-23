import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SessionService } from './session.service';
import { CreateSessionDto } from './session.dto';
import { RequestService } from '../requests/request.service';

@ApiTags('sessions')
@Controller('sessions')
export class SessionController {
    constructor(
        private readonly sessionService: SessionService,
        private readonly requestService: RequestService,
    ) {}

    @Post()
    @ApiOperation({ summary: 'Create a new session' })
    async create(@Body() createSessionDto: CreateSessionDto): Promise<any> {
        // TODO: Remove any
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
        const sessionEntity = await this.sessionService.create(createSessionDto);

        return { ...sessionEntity, baseUrl: `${backendUrl}/app/${sessionEntity.id}` };
    }
}
