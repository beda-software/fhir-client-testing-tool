import { Request } from '../modules/requests/request.entity';
import { Repository } from 'typeorm';

/**
 * Retrieves a list of requests with unavailable search parameters.
 *
 * @param repository - The repository to query for requests.
 * @param sessionId - The session ID to filter requests by.
 * @param resourceType - The resource type to filter requests by.
 * @param availableSearchParams - An array of available search parameters.
 * @returns A promise that resolves to an array of requests.
 */
export async function getRequestsWithUnavailableSearchParams(
    repository: Repository<Request>,
    sessionId: string,
    resourceType: string,
    availableSearchParams: string[],
): Promise<Request[]> {
    // NOTE: SQL query example
    // SELECT *
    // FROM request
    // WHERE sessionId = 123
    //   AND resourceType = 'Patient'
    //   AND fhirAction = 'SEARCH'
    //   AND jsonb_array_length(filters) = 1
    //   AND filters->0->>'code' NOT IN ('_id', 'family')

    return await repository
        .createQueryBuilder('request')
        .where('request.sessionId = :sessionId', { sessionId })
        .andWhere('request.resourceType = :resourceType', { resourceType })
        .andWhere('request.fhirAction = :action', { action: 'SEARCH' })
        .andWhere('jsonb_array_length(request.filters) = 1')
        .andWhere("request.filters->0->>'code' NOT IN (:...availableSearchParams)", { availableSearchParams })
        .getMany();
}

/**
 * Retrieves a list of requests with unavailable combination search parameters.
 *
 * @param repository - The repository to query requests from.
 * @param sessionId - The session ID to filter requests by.
 * @param resourceType - The resource type to filter requests by.
 * @param availableSearchParams - The available search parameters.
 * @returns A promise that resolves to an array of requests.
 */
export async function getRequestsWithUnavailableComboSearchParams(
    repository: Repository<Request>,
    sessionId: string,
    resourceType: string,
    availableSearchParams: string[][],
): Promise<Request[]> {
    // NOTE: SQL query example
    // SELECT *
    // FROM request
    // WHERE sessionId = 123
    //   AND resourceType = 'Patient'
    //   AND fhirAction = 'SEARCH'
    //   AND jsonb_array_length(filters) > 1
    //   AND NOT filters_codes <@ array[array['birthdate','family'], array['birthdate','name']]
    return await repository
        .createQueryBuilder('request')
        .where('request.sessionId = :sessionId', { sessionId })
        .andWhere('request.resourceType = :resourceType', { resourceType })
        .andWhere('request.fhirAction = :action', { action: 'SEARCH' })
        .andWhere('jsonb_array_length(request.filters) > 1')
        .andWhere('NOT request.filters_codes <@ :codes', {
            codes: availableSearchParams,
        })
        .getMany();
}
