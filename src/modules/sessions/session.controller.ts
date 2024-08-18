import { Controller, Post, Body, Param, Req, Res, All } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { SessionService } from './session.service';
import { CreateSessionDto } from './session.dto';
import { RequestService } from '../requests/request.service';
import { Request, Response } from 'express';
import { createRequestObject } from 'src/utils/data';
import { captureResponseBody } from 'src/utils/responses';

@ApiTags('sessions')
@Controller('sessions')
export class SessionController {
    // eslint-disable-next-line @typescript-eslint/ban-types
    private sessionListeners = new Map<string, Function>();

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

        return { ...sessionEntity, baseUrl: `${backendUrl}/sessions/${sessionEntity.id}` };
    }

    @All(':id/**')
    @ApiOperation({ summary: 'Proxy request to the target URL' })
    @ApiParam({ name: 'id', description: 'Session ID' })
    async proxyRequestGet(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
        const session = await this.sessionService.findOne(id);
        const proxyMiddleware = await this.sessionService.getProxyMiddleware(id);
        const responsePromise = captureResponseBody(res);

        // TODO: Implement the logic to manage listener
        if (!this.sessionListeners.has(id)) {
            const listener = async (req: Request, res: Response) => {
                proxyMiddleware(req, res);
                const responseBody = await responsePromise;
                const target = await this.sessionService.getTarget(id);
                await this.requestService.create(createRequestObject(id, target, session, req, res, responseBody));
            };
            this.sessionListeners.set(id, listener);
        }

        const listener = this.sessionListeners.get(id);
        listener(req, res);
    }
}
