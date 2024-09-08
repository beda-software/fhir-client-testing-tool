import { In, Not } from 'typeorm';
import { Patient } from 'fhir/r4';
import {
    getRequestsWithUnavailableComboSearchParams,
    getRequestsWithUnavailableSearchParams,
} from '../../../utils/clientTestingHelpers';
import { Request } from '../../../modules/requests/request.entity';
import { isResourceValid } from '@beda.software/fhir-validator';

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

describe('Patients test', () => {
    let requests: Request[];

    beforeAll(async () => {
        requests = await global.RequestsRepository.find({
            where: { session: { id: global.SESSION_ID }, resourceType: 'Patient' },
            relations: ['session'],
        });
    });

    test('Should only have available interactions', async () => {
        requests = await global.RequestsRepository.find({
            where: {
                session: { id: global.SESSION_ID },
                resourceType: 'Patient',
                fhirAction: Not(In(['READ', 'SEARCH', 'CREATE', 'UPDATE'])),
            },
            relations: ['session'],
        });
        expect(requests.length).toBe(0);
    });

    test('Should only have available search params', async () => {
        const requests = await getRequestsWithUnavailableSearchParams(
            global.RequestsRepository,
            global.SESSION_ID,
            'Patient',
            ['_id', 'birthdate', 'family', 'gender', 'identifier', 'name', 'gender-identity', 'indigenous-status'],
        );
        expect(requests.length).toBe(0);
    });

    test('Should only have available combo search params', async () => {
        const requests = await getRequestsWithUnavailableComboSearchParams(
            global.RequestsRepository,
            global.SESSION_ID,
            'Patient',
            [
                ['birthdate', 'family'],
                ['birthdate', 'name'],
                ['gender', 'name'],
                ['family', 'gender'],
            ],
        );
        expect(requests.length).toBe(0);
    });

    test('Should only have valid resources in CREATE action', async () => {
        expect(
            await patientRequestCreateValidPatient(requests.filter((request) => request.fhirAction === 'CREATE')),
        ).toBe(true);
    });
});
