import * as React from 'react';
import { Table, Tag } from 'antd';
import 'antd/dist/antd.compact.css';
import { useState, useEffect } from 'react';
import { Renderer } from 'src/controllers/Renderer';
import { IpcRendererEvent } from 'electron';

export const NeglectedPackets: React.FC = () => {
	const [neglectedPackets, setNeglectedPackets] = useState<Array<any>>([]);

	Renderer.on(
		'firewall-packets-getter-reply',
		(
			event: IpcRendererEvent,
			data: { matched: Array<any>; neglected: Array<any> }
		) => {
			setNeglectedPackets(data.neglected);
		}
	);

	useEffect(() => {
		setInterval(() => Renderer.send('firewall-packets-getter'), 1000);
	}, []);

	const columns = React.useRef([
		{
			title: 'Source IP',
			dataIndex: 'sourceIP',
			key: 'sourceIP',
		},
		{
			title: 'Source Port',
			dataIndex: 'sourcePort',
			key: 'sourcePort',
		},
		{
			title: 'Destination IP',
			dataIndex: 'destIP',
			key: 'destIP',
		},
		{
			title: 'Destination Port',
			dataIndex: 'destPort',
			key: 'destPort',
		},
		{
			title: 'Flag',
			key: 'flag',
			dataIndex: 'flag',
			render: (flag: string) => {
				let color = 'geekblue';
				if (flag === 'continue') color = 'green';
				else if (flag === 'end') color = 'red';
				return <Tag color={color}>{flag.toUpperCase()}</Tag>;
			},
		},
	]);

	return (
		<Table
			style={{ minHeight: '100%', height: '100%' }}
			dataSource={neglectedPackets}
			columns={columns.current}
			pagination={false}
			scroll={{ y: 600 }}
		/>
	);
};

export default NeglectedPackets;
