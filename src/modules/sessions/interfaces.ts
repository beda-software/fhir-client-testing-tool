import { Session } from './session.entity';

export interface SessionWithRequests extends Session {
    requestsNumber: number;
}

export interface SessionWithBaseUrl extends Session {
    baseUrl: string;
}
