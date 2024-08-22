import { DataSource } from 'typeorm';
import { Request } from '../modules/requests/request.entity';
import { Session } from '../modules/sessions/session.entity';
import { TestRun } from '../modules/test_runs/testRun.entity';
import {
    getRequestsWithUnavailableComboSearchParams,
    getRequestsWithUnavailableSearchParams,
} from './clientTestingHelpers';
import { v4 as uuidv4 } from 'uuid';

const TestDataSource = new DataSource({
    type: 'postgres',
    host: 'postgres',
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [Request, Session, TestRun],
    synchronize: true,
    dropSchema: true,
    logging: false,
});

const sessionUUID = uuidv4();

beforeAll(async () => {
    await TestDataSource.initialize();
    const sessionRepository = TestDataSource.getRepository(Session);
    const requestsRepository = TestDataSource.getRepository(Request);
    const sessionEntity = await sessionRepository.save({
        id: sessionUUID,
        target: 'http://test.com',
    });

    for (const requestData of [
        { resourceType: 'Patient', fhirAction: 'SEARCH', filters: [{ code: '_id', value: '123' }] },
        { resourceType: 'Patient', fhirAction: 'SEARCH', filters: [{ code: 'family', value: '123' }] },
        {
            resourceType: 'Patient',
            fhirAction: 'SEARCH',
            filters: [
                { code: 'family', value: '123' },
                { code: 'gender', value: 'unknown' },
            ],
        },
        {
            resourceType: 'Patient',
            fhirAction: 'SEARCH',
            filters: [
                { code: 'family', value: '123' },
                { code: 'name', value: 'unknown' },
            ],
        },
        {
            resourceType: 'Patient',
            fhirAction: 'SEARCH',
            filters: [
                { code: 'test', value: '123' },
                { code: 'name', value: 'unknown' },
            ],
        },
        { resourceType: 'Patent', fhirAction: 'CREATE' },
        { resourceType: 'Observation', fhirAction: 'SEARCH' },
    ]) {
        await requestsRepository.save({
            session: sessionEntity,
            resourceType: requestData.resourceType,
            fhirAction: requestData.fhirAction,
            requestMethod: 'GET',
            requestUri: '/Patient',
            remoteAddr: 'undefined',
            status: 200,
            userAgent: 'Mozilla/5.0',
            headers: {},
            filters: requestData.filters,
            filtersCodes: requestData.filters?.map((filter) => filter.code).sort() ?? [],
        });
    }
});

afterAll(async () => {
    await TestDataSource.destroy();
});

describe('Client testing helpers', () => {
    const requestsRepository = TestDataSource.getRepository(Request);
    it('Should return correct request entities via getRequestsWithUnavailableSearchParams', async () => {
        const requests = await getRequestsWithUnavailableSearchParams(requestsRepository, sessionUUID, 'Patient', [
            '_id',
        ]);

        expect(requests).toHaveLength(1);
    });

    it('Should return correct request entities via getRequestsWithUnavailableComboSearchParams', async () => {
        const requests = await getRequestsWithUnavailableComboSearchParams(requestsRepository, sessionUUID, 'Patient', [
            ['family', 'name'],
            ['family', 'gender'],
        ]);

        expect(requests).toHaveLength(1);
    });
});
