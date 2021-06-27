import * as React from 'react';
import { Tabs } from 'antd';
import 'antd/dist/antd.compact.css';
import MatchedPackets from './MatchedPackets';
import NeglectchedPackets from './NeglectedPackets';
import ConfigurationEditor from './ConfigurationEditor';

export const TabPages: React.FC = () => {
	const { TabPane } = Tabs;
	return (
		<Tabs
			defaultActiveKey="1"
			centered
			style={{
				height: '100vh',
				width: '100vw',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<TabPane tab="Matched" key="1">
				<MatchedPackets />
			</TabPane>
			<TabPane tab="Neglected" key="2">
				<NeglectchedPackets />
			</TabPane>
			<TabPane tab="Configuration" key="3">
				<ConfigurationEditor/>
			</TabPane>
		</Tabs>
	);
};
