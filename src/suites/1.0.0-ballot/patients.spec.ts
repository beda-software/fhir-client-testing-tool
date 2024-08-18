import { DataSource } from 'typeorm';
import { Request } from '../../modules/requests/request.entity';
import { Session } from '../../modules/sessions/session.entity';
import { TestRun } from '../../modules/test_runs/testRun.entity';
import { isResourceValid } from '../../utils/services';
import { Patient } from 'fhir/r4';

const TestDataSource = new DataSource({
    type: 'postgres',
    host: 'postgres',
    port: 5432,
    username: 'myuser',
    password: 'mypassword',
    database: 'mydatabase',
    entities: [Request, Session, TestRun],
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
    const availableInteractions = ['READ', 'SEARCH', 'CREATE', 'UPDATE'];
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

async function patientRequestCreateValidPatient(requests: Request[]): Promise<boolean> {
    const createRequests = requests.filter((request) => request.fhirAction === 'CREATE');
    const filteredRequests = createRequests.filter((request) => request.requestBody.resourceType === 'Patient');
    const invalidResources = await Promise.all(
        filteredRequests.map(async (request) => await isResourceValid(request.requestBody as Patient)),
    );

    return invalidResources.length === 0;
}

describe('Patients test', () => {
    let requests: Request[];

    beforeAll(async () => {
        const requestRepository = TestDataSource.getRepository(Request);
        requests = await requestRepository.find({
            where: { session: { id: global.SESSION_ID } },
            relations: ['session'],
        });
        requests = requests.filter((request) => request.resourceType === 'Patient');
    });

    test('Should only have available interactions', () => {
        expect(patientRequestsOnlyAvailableInteractionsExists(requests)).toBe(true);
    });

    test('Should only have available search params', () => {
        expect(
            patientRequestsOnlyAvailableSearchParamsExists(
                requests.filter((request) => request.fhirAction === 'SEARCH'),
            ),
        ).toBe(true);
    });

    test('Should only have available combo search params', () => {
        expect(
            patientRequestsOnlyAvailableComboSearchParamsExists(
                requests.filter((request) => request.fhirAction === 'SEARCH'),
            ),
        ).toBe(true);
    });

    test('Should only have valid resources in CREATE action', async () => {
        expect(
            await patientRequestCreateValidPatient(requests.filter((request) => request.fhirAction === 'CREATE')),
        ).toBe(true);
    });
});
