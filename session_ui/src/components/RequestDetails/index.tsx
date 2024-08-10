import { DescriptionsProps, Descriptions } from "antd";
import { Request } from "../../containers/sessions/interfaces";

export function RequestDetails({ request }: { request: Request }) {
    const { requestMethod, requestUri, fhirAction, remoteAddr,
        userAgent, headers, resourceType, offset, count, fields,
        total, summary, format, include, revInclude, sortRules, filters, status } = request;

    const items: DescriptionsProps['items'] = [
        {
            key: '0',
            label: 'Status',
            children: status,
        },
        {
            key: '1',
            label: 'Method',
            children: requestMethod,
        },
        {
            key: '2',
            label: 'URI',
            children: requestUri,
        },
        {
            key: '3',
            label: 'FHIR Action',
            children: fhirAction,
        },
        {
            key: '4',
            label: 'Remote Address',
            children: remoteAddr,
        },
        {
            key: '5',
            label: 'User Agent',
            children: userAgent,
        },
        {
            key: '6',
            label: 'Headers',
            children: headers,
        },
        {
            key: '7',
            label: 'Resource Type',
            children: resourceType,
        },
        {
            key: '8',
            label: 'Offset',
            children: offset,
        },
        {
            key: '9',
            label: 'Count',
            children: count,
        },
        {
            key: '10',
            label: 'Fields',
            children: fields,
        },
        {
            key: '11',
            label: 'Total',
            children: total,
        },
        {
            key: '12',
            label: 'Summary',
            children: summary,
        },
        {
            key: '13',
            label: 'Format',
            children: format,
        },
        {
            key: '14',
            label: 'Include',
            children: include,
        },
        {
            key: '15',
            label: 'Revinclude',
            children: revInclude,
        },
        {
            key: '16',
            label: 'Sort Rules',
            children: sortRules,
        },
        {
            key: '17',
            label: 'Filters',
            children: filters,
        },
    ];

    return <Descriptions items={items} />;
}