export interface Request {
    id: string;
    requestMethod: string;
    fhirAction: string;
    requestUri: string;
    remoteAddr: string;
    userAgent: string;
    headers: string;
    dt: Date;
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
    sessionId: string;
    status: string;
    responseData: string;
}