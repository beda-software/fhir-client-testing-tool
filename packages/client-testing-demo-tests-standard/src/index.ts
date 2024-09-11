import { Patient } from 'fhir/r4';
import { Request } from '@beda.software/app/src/modules/requests/request.entity';
import { isResourceValid } from '@beda.software/fhir-validator';

export function patientDemoTest() {
    describe('Patients test (2nd version)', () => {
        let requests: Request[] = [];
        beforeAll(async () => {
            requests = global.requests.filter((request) => request.resourceType === 'Patient' && request.session.id === global.SESSION_ID);
        });

        test('Should only have available interactions', async () => {
            const availableInteractions = ['READ', 'SEARCH', 'CREATE', 'UPDATE'];
            const filteredRequests = requests.filter((request) => !availableInteractions.includes(request.fhirAction));

            expect(filteredRequests.length).toBe(0);
        });

        test('Should only have available search params', async () => {
            const availableSearchParams = new Set([
                '_id',
                'birthdate',
                'family',
                'gender',
                'identifier',
                'name',
                'gender-identity',
                'indigenous-status',
            ]);
            const filteredRequests = new Set(
                requests
                    .filter((request) => request.filtersCodes.length === 1)
                    .map((request) => request.filtersCodes[0]),
            );

            expect(filteredRequests.isSubsetOf(availableSearchParams)).toBe(true);
        });

        test('Should only have available combo search params', async () => {
            const availableComboSearchParams = new Set(['birthdate+family', 'birthdate+name', 'gender+name', 'family+gender']);
            const filteredRequests = new Set(requests.filter((request) => request.filtersCodes.length > 1).map((request) => request.filtersCodes.join('+')));

            expect(filteredRequests.isSubsetOf(availableComboSearchParams)).toBe(true);
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
