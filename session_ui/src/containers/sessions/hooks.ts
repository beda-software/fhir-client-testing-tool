import { message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { config } from "../../config";
import { Request } from './interfaces';

export function useSessionDetails(sessionId?: string) {
    const [loading, setLoading] = useState<boolean>(false);
    const [requests, setRequests] = useState<Request[] | undefined>([]);

    useEffect(() => {
        if (sessionId) {
            setLoading(true);
            axios.get(`${config.backendUrl}/requests?session=${sessionId}`)
                .then(response => {
                    setRequests(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    message.error('Failed to load data');
                    setLoading(false);
                });
        }
    }, [sessionId]);

    return {
        requests,
        loading
    }
}
