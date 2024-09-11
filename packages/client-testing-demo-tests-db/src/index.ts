import { In, Not } from 'typeorm';

export function patientDemoTestDB() {
    describe('Patients test', () => {
        test('Should only have available interactions', async () => {
            const requests = await global.RequestsRepository.find({
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
            // NOTE: SQL query example
            // SELECT *
            // FROM request
            // WHERE sessionId = 123
            //   AND resourceType = 'Patient'
            //   AND fhirAction = 'SEARCH'
            //   AND jsonb_array_length(filters) = 1
            //   AND filters->0->>'code' NOT IN ('_id', 'family')

            const requests = await global.RequestsRepository.createQueryBuilder('request')
                .where('request.sessionId = :sessionId', { sessionId: global.SESSION_ID })
                .andWhere('request.resourceType = :resourceType', { resourceType: 'Patient' })
                .andWhere('request.fhirAction = :action', { action: 'SEARCH' })
                .andWhere('jsonb_array_length(request.filters) = 1')
                .andWhere("request.filters->0->>'code' NOT IN (:...availableSearchParams)", { availableSearchParams: ['_id', 'birthdate', 'family', 'gender', 'identifier', 'name', 'gender-identity', 'indigenous-status'] })
                .getMany();

            expect(requests.length).toBe(0);
        });

        test('Should only have available combo search params', async () => {
            // NOTE: SQL query example
            // SELECT *
            // FROM request
            // WHERE sessionId = 123
            //   AND resourceType = 'Patient'
            //   AND fhirAction = 'SEARCH'
            //   AND jsonb_array_length(filters) > 1
            //   AND NOT filters_codes <@ array[array['birthdate','family'], array['birthdate','name']]
            const requests = await global.RequestsRepository.createQueryBuilder('request')
                .where('request.sessionId = :sessionId', { sessionId: global.SESSION_ID })
                .andWhere('request.resourceType = :resourceType', { resourceType: 'Patient' })
                .andWhere('request.fhirAction = :action', { action: 'SEARCH' })
                .andWhere('jsonb_array_length(request.filters) > 1')
                .andWhere('NOT request.filters_codes <@ :codes', {
                    codes: [
                        ['birthdate', 'family'],
                        ['birthdate', 'name'],
                        ['gender', 'name'],
                        ['family', 'gender'],
                    ],
                })
                .getMany();

            expect(requests.length).toBe(0);
        });
    });
}
