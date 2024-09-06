import { All, Controller, Param, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { createRequestObject } from 'src/utils/data';
import { captureResponseBody } from '@beda.software/client-testing-proxy-helpers';
import { RequestService } from '../requests/request.service';
import { SessionService } from '../sessions/session.service';
import { Request, Response } from 'express';

@ApiTags('app')
@Controller('app')
export class ProxyAppController {
    // eslint-disable-next-line @typescript-eslint/ban-types
    private sessionListeners = new Map<string, Function>();

    constructor(
        private readonly sessionService: SessionService,
        private readonly requestService: RequestService,
    ) {}

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
