export interface Request {
    id: string;
    request_method: string;
    fhir_action: string;
    request_uri: string;
    remote_addr: string;
    user_agent: string;
    headers: string;
    dt: Date;
    data: string;
    resource_type: string;
    offset: string;
    count: string;
    fields: string;
    total: string;
    summary: string;
    format: string;
    include: string;
    revinclude: string;
    sort_rules: string;
    filters: string;
    session_id: string;
    status: string;
    response_data: string;
}