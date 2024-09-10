import { DataSource } from 'typeorm';
import { Request } from '../modules/requests/request.entity';
import { Session } from '../modules/sessions/session.entity';
import { TestRun } from '../modules/test_runs/testRun.entity';
import {
    getRequestsWithUnavailableComboSearchParams,
    getRequestsWithUnavailableSearchParams,
} from './clientTestingHelpers';
import { v4 as uuidv4 } from 'uuid';
import { createRequestObject } from './data';

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

    for (const searchParameters of [
        '/Patient?_id=123',
        '/Patient?family=123',
        '/Patient?family=123&gender=unknown',
        '/Patient?family=123&name=unknown',
        '/Patient?test=123&gender=unknown',
        '/Observation?_id=123',
    ]) {
        await requestsRepository.save(
            createRequestObject(
                sessionUUID,
                'http://test.com',
                sessionEntity,
                {
                    method: 'GET',
                    headers: { 'user-agent': 'Mozilla/5.0' },
                    body: {},
                    originalUrl: `${sessionEntity.target}/sessions/${sessionUUID}/${searchParameters}`,
                    ip: '192.168.0.1',
                },
                { statusCode: 200 },
                '{}',
            ),
        );
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
