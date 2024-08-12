import { Controller, Post, Body, Param, Req, Res, All, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { SessionService } from './session.service';
import { Session } from './session.entity';
import { CreateSessionDto } from './session.dto';
import { RequestService } from '../requests/request.service';
import { Request, Response } from 'express';
import { createRequestObject } from 'src/utils/data';
import { captureResponseBody } from 'src/utils/responses';

@ApiTags('sessions')
@Controller('sessions')
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly requestService: RequestService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new session' })
  create(@Body() createSessionDto: CreateSessionDto): Promise<Session> {
    return this.sessionService.create(createSessionDto);
  }

  @All(':id/**')
  @ApiOperation({ summary: 'Proxy request to the target URL' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  async proxyRequestGet(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const session = await this.sessionService.findOne(id);
    const proxyMiddleware = await this.sessionService.getProxyMiddleware(id);
    const responsePromise = captureResponseBody(res);

    proxyMiddleware(req, res);

    const responseBody = await responsePromise;
    const target = await this.sessionService.getTarget(id);

    await this.requestService.create(
      createRequestObject(id, target, session, req, res, responseBody),
    );
  }
}
