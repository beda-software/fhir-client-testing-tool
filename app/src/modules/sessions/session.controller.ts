import { Controller, Get, Post, Body, Param, Req, Res } from '@nestjs/common';
import { SessionService } from './session.service';
import { Session } from './session.entity';
import { CreateSessionDto } from './session.dto';
import { RequestService } from '../requests/request.service';
import { ResponseService } from '../responses/response.service';
import { Request, Response } from 'express';
import { createRequestObject, createResponseObject } from 'src/utils/data';
import { captureResponseBody } from 'src/utils/responses';

@Controller('sessions')
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly requestService: RequestService,
    private readonly responseService: ResponseService,
  ) {}

  @Post()
  create(@Body() createSessionDto: CreateSessionDto): Promise<Session> {
    return this.sessionService.create(createSessionDto);
  }

  @Get(':id/**')
  @Post(':id/**')
  async proxyRequestGet(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const proxyMiddleware = await this.sessionService.getProxyMiddleware(id);
    const responsePromise = captureResponseBody(res);

    proxyMiddleware(req, res);

    const responseBody = await responsePromise;
    const target = await this.sessionService.getTarget(id);

    await this.requestService.create(
      createRequestObject(id, target, req, res, responseBody),
    );
  }
}
