import { Controller, Get, Post, Body, Param, Req, Res } from '@nestjs/common';
import { SessionService } from './session.service';
import { Session } from './session.entity';
import { CreateSessionDto } from './session.dto';
import { parseSearchRequest } from '@medplum/core';
import { RequestService } from '../requests/request.service';
import { ResponseService } from '../responses/response.service';

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

  @Post(':id/**')
  async proxyRequestPost(
    @Param('id') id: string,
    @Req() req: any,
    @Res() res: any,
  ) {
    const proxyMiddleware = await this.sessionService.getProxyMiddleware(id);
    proxyMiddleware(req, res);
  }

  @Get(':id/**')
  async proxyRequestGet(
    @Param('id') id: string,
    @Req() req: any,
    @Res() res: any,
  ) {
    const proxyMiddleware = await this.sessionService.getProxyMiddleware(id);
    const target = await this.sessionService.getTarget(id);
    const searchRequest = req.originalUrl.replace(`/sessions/${id}`, target);
    const {
      resourceType,
      offset,
      count,
      fields,
      total,
      summary,
      format,
      include,
      revInclude,
      sortRules,
      filters,
    } = parseSearchRequest(searchRequest);

    const request = await this.requestService.create({
      request_method: 'GET',
      fhir_action: 'search',
      request_uri: searchRequest,
      remote_addr: req.ip,
      user_agent: req.headers['user-agent'],
      headers: JSON.stringify(req.headers),
      data: '',
      resource_type: resourceType,
      offset: String(offset),
      count: String(count),
      fields: String(fields),
      total: total,
      summary: summary,
      format: format,
      include: String(include),
      revinclude: String(revInclude),
      sort_rules: String(sortRules),
      filters: String(filters),
    });
    await this.responseService.create({
      requestId: request.id,
      status: res.statusCode,
      headers: JSON.stringify(req.headers),
      data: '',
    });
    proxyMiddleware(req, res);
  }
}
