import { parseSearchRequest } from '@medplum/core';
import { Request, Response } from 'express';
import { CreateRequestDto } from 'src/modules/requests/request.dto';
import { Session } from 'src/modules/sessions/session.entity';
import { getFHIRAction } from '@beda.software/client-testing-helpers';

export function createRequestObject(
    id: string,
    target: string,
    session: Session,
    req: Pick<Request, 'ip' | 'method' | 'originalUrl' | 'headers' | 'body'>,
    res: Pick<Response, 'statusCode'>,
    responseBody: string,
): CreateRequestDto {
    const searchRequest = req.originalUrl.replace(`/app/${id}`, target);
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
        const suiteId = testFilePath.split('/')?.[4];
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
