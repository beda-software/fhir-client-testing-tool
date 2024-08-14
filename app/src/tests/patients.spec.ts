import { DataSource } from 'typeorm';
import { Request } from '../modules/requests/request.entity';
import { Session } from '../modules/sessions/session.entity';

const TestDataSource = new DataSource({
    type: 'postgres',
    host: 'postgres',
    port: 5432,
    username: 'myuser',
    password: 'mypassword',
    database: 'mydatabase',
    entities: [Request, Session],
    synchronize: true,
    logging: false,
});

beforeAll(async () => {
    await TestDataSource.initialize();
});

afterAll(async () => {
    await TestDataSource.destroy();
});

function patientRequestsOnlyAvailableInteractionsExists(requests: Request[]): boolean {
    const availableInteractions = ['READ', 'SEARCH'];
    const filteredRequests = requests.filter((request) => !availableInteractions.includes(request.fhirAction));

    return filteredRequests.length === 0;
}

function patientRequestsOnlyAvailableSearchParamsExists(requests: Request[]): boolean {
    const availableSearchParams = [
        '_id',
        'birthdate',
        'family',
        'gender',
        'identifier',
        'name',
        'gender-identity',
        'indigenous-status',
    ];

    return checkAvailableParams(availableSearchParams, false, requests);
}

function patientRequestsOnlyAvailableComboSearchParamsExists(requests: Request[]): boolean {
    const availableComboSearchParams = ['birthdate+family', 'birthdate+name', 'gender+name', 'family+gender'];

    return checkAvailableParams(availableComboSearchParams, true, requests);
}

function checkAvailableParams(availableParams: string[], combo: boolean, requests: Request[]): boolean {
    const filterCombo = (param: string) => (combo ? param.includes('+') : !param.includes('+'));
    const usedComboSearchParams = requests
        .flatMap((request) => request.filters.map((filter) => filter.code))
        .filter((param) => filterCombo(param));

    const uniqueUsedComboSearchParams = [...new Set(usedComboSearchParams)];

    return uniqueUsedComboSearchParams.every((searchParam) => availableParams.includes(searchParam));
}

describe('Patients test', () => {
    test.each([
        [patientRequestsOnlyAvailableInteractionsExists],
        [patientRequestsOnlyAvailableSearchParamsExists],
        [patientRequestsOnlyAvailableComboSearchParamsExists],
    ])('Should be valid according to the IG %s', async (method) => {
        const requestRepository = TestDataSource.getRepository(Request);
        const requests = await requestRepository.find({
            where: { session: { id: global.SESSION_ID } },
            relations: ['session'],
        });
        expect(method(requests.filter((request) => request.resourceType === 'Patient'))).toBe(true);
    });
});
