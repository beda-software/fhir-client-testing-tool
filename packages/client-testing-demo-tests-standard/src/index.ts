import { Patient } from 'fhir/r4';
import { Request } from '@beda.software/app/src/modules/requests/request.entity';
import { isResourceValid } from '@beda.software/fhir-validator';

function checkAvailableParams(availableParams: string[], combo: boolean, requests: Request[]): boolean {
    const filterCombo = (param: string) => (combo ? param.includes('+') : !param.includes('+'));
    const usedComboSearchParams = requests
        .flatMap((request) => request.filters.map((filter) => filter.code))
        .filter((param) => filterCombo(param));

    const uniqueUsedComboSearchParams = [...new Set(usedComboSearchParams)];

    return uniqueUsedComboSearchParams.every((searchParam) => availableParams.includes(searchParam));
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
            const availableInteractions = ['READ', 'SEARCH', 'CREATE', 'UPDATE'];
            const filteredRequests = requests.filter((request) => !availableInteractions.includes(request.fhirAction));

            expect(filteredRequests.length).toBe(0);
        });

        test('Should only have available search params', async () => {
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

            expect(checkAvailableParams(availableSearchParams, false, requests)).toBe(true);
        });

        test('Should only have available combo search params', async () => {
            const availableComboSearchParams = ['birthdate+family', 'birthdate+name', 'gender+name', 'family+gender'];

            expect(checkAvailableParams(availableComboSearchParams, true, requests)).toBe(true);
        });

        test('Should only have valid resources in CREATE action', async () => {
            const filteredRequests = requests.filter(
                (request) => request.fhirAction === 'CREATE' && request.requestBody?.resourceType === 'Patient',
            );
            const validationStatuses = await Promise.all(
                filteredRequests.map(async (request) => await isResourceValid(request.requestBody as Patient)),
            );
            const falseValidations = validationStatuses.filter((status) => status === false);

            expect(falseValidations.length).toBe(0);
        });
    });
}
