import { Request } from 'express';

export function getFHIRAction(requestType: Request['method'], url: Request['url']) {
    const mapSimpleRequest = {
        DELETE: 'DELETE',
        PATCH: 'PATCH',
        PUT: 'UPDATE',
    };

    if (Object.keys(mapSimpleRequest).includes(requestType)) {
        return mapSimpleRequest[requestType];
    }

    if (requestType === 'POST') {
        if (url.includes('_search')) {
            return 'SEARCH';
        }
        return 'CREATE';
    }

    if (requestType === 'GET') {
        if (url.includes('_history')) {
            if (url.match(/\/_history\/\d+$/)) {
                return 'VREAD';
            }
            return 'HISTORY';
        }

        if (url.includes('?')) {
            return 'SEARCH';
        }

        return 'READ';
    }
}
