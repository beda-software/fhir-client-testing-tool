import { Request as RequestType, Response } from 'express';
import { Session } from '../sessions/session.entity';

export class CreateRequestDto {
  session: Session;
  requestMethod: RequestType['method'];
  fhirAction: string;
  requestUri: string;
  remoteAddr: string;
  userAgent: string;
  headers: string;
  data: string;
  resourceType: string;
  offset: string;
  count: string;
  fields: string;
  total: string;
  summary: string;
  format: string;
  include: string;
  revInclude: string;
  sortRules: string;
  filters: string;
  status: Response['statusCode'];
  responseData: Record<string, any>;
}
