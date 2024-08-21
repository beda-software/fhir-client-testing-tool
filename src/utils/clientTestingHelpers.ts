import { Request } from 'src/modules/requests/request.entity';
import { Repository } from 'typeorm';

export async function getRequestsWithUnavailableSearchParams(
    repository: Repository<Request>,
    sessionId: string,
    resourceType: string,
    availableSearchParams: string[],
): Promise<Request[]> {
    return await repository
        .createQueryBuilder('request')
        .where('request.sessionId = :sessionId', { sessionId })
        .andWhere('request.resourceType = :resourceType', { resourceType })
        .andWhere('request.fhirAction = SEARCH')
        .andWhere('jsonb_array_length(request.filters) = 1')
        .andWhere("request.filters->0->>'code' NOT IN (:...availableSearchParams)", { availableSearchParams })
        .getMany();
}
