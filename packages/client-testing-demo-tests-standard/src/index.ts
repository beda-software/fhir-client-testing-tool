import { Patient } from 'fhir/r4';
import { Request } from '@beda.software/app/src/modules/requests/request.entity';
import { isResourceValid } from '@beda.software/fhir-validator';

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
    const filteredRequests = requests.filter(
        (request) => request.fhirAction === 'CREATE' && request.requestBody?.resourceType === 'Patient',
    );
    const validationStatuses = await Promise.all(
        filteredRequests.map(async (request) => await isResourceValid(request.requestBody as Patient)),
    );
    const falseValidations = validationStatuses.filter((status) => status === false);

    return falseValidations.length === 0;
}

export function patientDemoTest() {
    describe('Patients test (2nd version)', () => {
        let requests: Request[];

        beforeAll(async () => {
            requests = await global.RequestsRepository.find({
                where: { session: { id: global.SESSION_ID }, resourceType: 'Patient' },
                relations: ['session'],
            });
        });

        test('Should only have available interactions', async () => {
            expect(patientRequestsOnlyAvailableInteractionsExists(requests)).toBe(true);
        });

        test('Should only have available search params', async () => {
            expect(patientRequestsOnlyAvailableSearchParamsExists(requests)).toBe(true);
        });

        test('Should only have available combo search params', async () => {
            expect(patientRequestsOnlyAvailableComboSearchParamsExists(requests)).toBe(true);
        });

        test('Should only have valid resources in CREATE action', async () => {
            expect(
                await patientRequestCreateValidPatient(requests.filter((request) => request.fhirAction === 'CREATE')),
            ).toBe(true);
        });
    });
}
