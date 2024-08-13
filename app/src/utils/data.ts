import { parseSearchRequest } from '@medplum/core';
import { Request, Response } from 'express';
import { CreateRequestDto } from 'src/modules/requests/request.dto';
import { Session } from 'src/modules/sessions/session.entity';
import { getFHIRAction } from './helpers';

export function createRequestObject(
  id: string,
  target: string,
  session: Session,
  req: Request,
  res: Response,
  responseBody: string,
): CreateRequestDto {
  const searchRequest = req.originalUrl.replace(`/sessions/${id}`, target);
  const searchReqObj = parseSearchRequest(searchRequest);
  return {
    session: session,
    requestMethod: req.method,
    fhirAction: getFHIRAction(req.method, searchRequest),
    requestUri: searchRequest,
    remoteAddr: req.ip ?? '',
    userAgent: req.headers['user-agent'],
    headers: req.headers,
    data: '',
    resourceType: searchReqObj.resourceType,
    offset: String(searchReqObj.offset),
    count: String(searchReqObj.count),
    fields: String(searchReqObj.fields),
    total: searchReqObj.total,
    summary: searchReqObj.summary,
    format: searchReqObj.format,
    include: JSON.stringify(searchReqObj.include),
    revInclude: JSON.stringify(searchReqObj.revInclude),
    sortRules: JSON.stringify(searchReqObj.sortRules),
    filters: searchReqObj.filters,
    status: res.statusCode,
    responseBody: JSON.parse(responseBody),
  };
}
