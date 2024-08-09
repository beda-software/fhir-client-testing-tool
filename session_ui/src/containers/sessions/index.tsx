import { useParams } from "react-router-dom";
import { useSessionDetails } from "./hooks"
import { Button, notification, Table, Tabs, TabsProps } from "antd";
import { config } from "../../config";

export function Sessions() {
    const { sessionId } = useParams();
    const { requests } = useSessionDetails(sessionId)
    const availableSessionUrl = `${config.backendUrl}/sessions/${sessionId}`
    const copyToClipboard = (text: string) => navigator.clipboard.writeText(text)
    const dataSource = requests?.map((request, index) => {
        return {
            key: index,
            status: '200',
            uri: request.request_uri,
            method: request.request_method,
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
            {dataSource && dataSource?.length > 0 ? <Table dataSource={dataSource} columns={columns} expandable={{
                expandedRowRender: (record) => {
                    const items: TabsProps['items'] = [
                        {
                            key: '1',
                            label: 'Request details',
                            children: <pre>{JSON.stringify(record.entity, null, 2)}</pre>,
                        },
                        {
                            key: '2',
                            label: 'Response body',
                            children: <pre>{JSON.stringify(JSON.parse(record.entity.response_data), null, 2)}</pre>,
                        }
                    ];

                    return <Tabs defaultActiveKey="1" items={items} />;
                }
            }} /> : <><h1>Available URL to use</h1><h2>{availableSessionUrl}</h2><Button type="primary" onClick={() => {
                copyToClipboard(availableSessionUrl)
                notification.success({ message: 'Link copied to clickboard' })
            }}>Copy</Button></>}
        </div>
    );
}