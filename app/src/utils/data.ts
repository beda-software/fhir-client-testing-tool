import { parseSearchRequest } from '@medplum/core';
import { Request, Response } from 'express';
import { Request as RequestEntity } from '../modules/requests/request.entity';

export function createRequestObject(id: string, target: string, req: Request) {
  const searchRequest = req.originalUrl.replace(`/sessions/${id}`, target);
  const searchReqObj = parseSearchRequest(searchRequest);
  return {
    session_id: id,
    request_method: 'GET',
    fhir_action: 'search',
    request_uri: searchRequest,
    remote_addr: req.ip ?? '',
    user_agent: req.headers['user-agent'],
    headers: JSON.stringify(req.headers),
    data: '',
    resource_type: searchReqObj.resourceType,
    offset: String(searchReqObj.offset),
    count: String(searchReqObj.count),
    fields: String(searchReqObj.fields),
    total: searchReqObj.total,
    summary: searchReqObj.summary,
    format: searchReqObj.format,
    include: JSON.stringify(searchReqObj.include),
    revinclude: JSON.stringify(searchReqObj.revInclude),
    sort_rules: JSON.stringify(searchReqObj.sortRules),
    filters: JSON.stringify(searchReqObj.filters),
  };
}

export function createResponseObject(
  req: RequestEntity,
  res: Response,
  data?: string,
) {
  return {
    requestId: req.id,
    status: String(res.statusCode),
    headers: '',
    data: data,
  };
}
