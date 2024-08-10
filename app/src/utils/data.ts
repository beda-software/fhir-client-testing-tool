import { parseSearchRequest } from '@medplum/core';
import { Request, Response } from 'express';
import { CreateRequestDto } from 'src/modules/requests/request.dto';
import { Session } from 'src/modules/sessions/session.entity';

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
    requestMethod: 'GET',
    fhirAction: 'search',
    requestUri: searchRequest,
    remoteAddr: req.ip ?? '',
    userAgent: req.headers['user-agent'],
    headers: JSON.stringify(req.headers),
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
    filters: JSON.stringify(searchReqObj.filters),
    status: res.statusCode,
    responseData: JSON.parse(responseBody),
  };
}