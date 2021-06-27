import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Table, Tag } from 'antd';
import { Renderer } from 'src/controllers/Renderer';
import { IpcRendererEvent } from 'electron';
import 'antd/dist/antd.compact.css';

export const MatchedPackets: React.FC = () => {
	const [matchedPackets, setMatchedPackets] = useState<Array<any>>([]);

	Renderer.on(
		'firewall-packets-getter-reply',
		(
			event: IpcRendererEvent,
			data: { matched: Array<any>; neglected: Array<any> }
		) => {
			setMatchedPackets(data.matched);
		}
	);

	useEffect(() => {
		setInterval(() => Renderer.send('firewall-packets-getter'), 1000);
	}, []);

	const columns = useRef([
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
		{
			title: 'Action',
			key: 'action',
			dataIndex: 'action',
			render: (action: string) => {
				let color = 'volcano';
				if (action === 'allow') color = 'yellow';
				return <Tag color={color}>{action.toUpperCase()}</Tag>;
			},
		},
		{
			title: 'Rule',
			dataIndex: 'rule',
			key: 'rule',
		},
	]);

	return (
		<Table
			style={{ minHeight: '100%', height: '100%' }}
			dataSource={matchedPackets}
			columns={columns.current}
			pagination={false}
			scroll={{ y: 600 }}
		/>
	);
};

export default MatchedPackets;
