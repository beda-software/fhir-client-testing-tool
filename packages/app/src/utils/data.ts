import { parseSearchRequest } from '@medplum/core';
import { Request, Response } from 'express';
import { CreateRequestDto } from '../modules/requests/request.dto';
import { Session } from '../modules/sessions/session.entity';

export function getFHIRAction(requestType: Request['method'], url: Request['url']) {
    const mapSimpleRequest = {
        DELETE: 'DELETE',
        PATCH: 'PATCH',
        PUT: 'UPDATE',
    };

    if (Object.keys(mapSimpleRequest).includes(requestType)) {
        return mapSimpleRequest[requestType];
    }

    if (requestType === 'POST') {
        if (url.includes('_search')) {
            return 'SEARCH';
        }
        return 'CREATE';
    }

    if (requestType === 'GET') {
        if (url.includes('_history')) {
            if (url.match(/\/_history\/\d+$/)) {
                return 'VREAD';
            }
            return 'HISTORY';
        }

        if (url.includes('?')) {
            return 'SEARCH';
        }

        return 'READ';
    }
}

export function createRequestObject(
    id: string,
    target: string,
    session: Session,
    req: Pick<Request, 'ip' | 'method' | 'originalUrl' | 'headers' | 'body'>,
    res: Pick<Response, 'statusCode'>,
    responseBody: string,
): CreateRequestDto {
    const searchRequest = req.originalUrl.replace(`/proxy/${id}`, target);
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
        filtersCodes: searchReqObj.filters?.map((filter) => filter.code).sort() ?? [],
        status: res.statusCode,
        responseBody: JSON.parse(responseBody),
        requestBody: req.body,
    };
}

export function createTestListObject(testRun: any) {
    const { results } = testRun;

    const preparedResults = results.testResults.map((resultItem) => {
        const testFilePath = resultItem.testFilePath;
        const suiteId = testFilePath.split('/')?.[3];
        const groupsRaw = resultItem.testResults.map((testItem) => {
            return {
                groupName: testItem.ancestorTitles[0],
                testTitle: testItem.fullName,
            };
        });

        const groupNames = [...new Set(groupsRaw.map((groupItem) => groupItem.groupName))];
        const groups = groupNames.map((groupName) => {
            return {
                groupName: groupName,
                tests: groupsRaw.filter((groupItem) => groupItem.groupName === groupName).map((a) => a.testTitle),
            };
        });

        return {
            suiteId: suiteId,
            groups: groups,
        };
    });

    return preparedResults;
}
