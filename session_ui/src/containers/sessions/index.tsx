import { useParams } from "react-router-dom";
import { useSessionDetails } from "./hooks"
import { Button, notification, Table, Tabs, TabsProps } from "antd";
import { config } from "../../config";
import { RequestDetails } from "../../components/RequestDetails";

export function Sessions() {
    const { sessionId } = useParams();
    const { requests } = useSessionDetails(sessionId)
    const availableSessionUrl = `${config.backendUrl}/sessions/${sessionId}`
    const copyToClipboard = (text: string) => navigator.clipboard.writeText(text)
    const dataSource = requests?.map((request, index) => {
        return {
            key: index,
            status: request.status,
            uri: request.requestUri,
            method: request.requestMethod,
            dt: request.dt,
            entity: request,
        }
    })

    const columns = [
        Table.EXPAND_COLUMN,
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'URI',
            dataIndex: 'uri',
            key: 'uri',
        },
        {
            title: 'Method',
            dataIndex: 'method',
            key: 'method',
        },
        {
            title: 'DT',
            dataIndex: 'dt',
            key: 'dt'
        },
    ];


    return (
        <div>
            {dataSource && dataSource?.length > 0 ? <Table style={{ width: '100%' }} dataSource={dataSource} columns={columns} expandable={{
                expandedRowRender: (record) => {
                    const items: TabsProps['items'] = [
                        {
                            key: '1',
                            label: 'Request details',
                            children: <RequestDetails request={record.entity} />,
                        },
                        {
                            key: '2',
                            label: 'Response body',
                            children: <pre>{JSON.stringify(record.entity.responseData, null, 2)}</pre>,
                        }
                    ];

                    return <Tabs defaultActiveKey="1" items={items} />;
                }
            }} /> : <><h1>Available URL to use</h1><h2>{availableSessionUrl}</h2><Button type="primary" onClick={() => {
                copyToClipboard(availableSessionUrl)
                notification.success({ message: 'Link copied to clipboard' })
            }}>Copy</Button></>}
        </div>
    );
}