import * as React from 'react';
import { useState, useEffect } from 'react';
import {
	Table,
	Input,
	InputNumber,
	Popconfirm,
	Form,
	Button,
	Typography,
} from 'antd';
import { Renderer } from 'src/controllers/Renderer';
import { IpcRendererEvent } from 'electron';
import 'assets/css/config_editor.css';
import input from 'antd/lib/input';

interface Item {
	key: string;
	action: string;
	prefix: string;
	port: number;
	modifier: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
	editing: boolean;
	dataIndex: string;
	title: any;
	inputType: 'number' | 'text';
	record: Item;
	index: number;
	children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
	editing,
	dataIndex,
	title,
	inputType,
	record,
	index,
	children,
	...restProps
}) => {
	const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
	return (
		<td {...restProps}>
			{editing ? (
				<Form.Item
					name={dataIndex}
					style={{ margin: 0 }}
					rules={[
						{
							required: dataIndex !== 'modifier',
							message: `Please Input ${title}!`,
						},
						dataIndex === 'prefix'
							? {
									validator: (_, value) => {
										const prefix = value.match(
											/^(\d+)\.(\d+)\.(\d+)\.(\d+)\/(\d+)|\*$/
										);
										if (prefix && prefix[0] === '*')
											return Promise.resolve();
										else if (
											prefix &&
											prefix[1] <= 255 &&
											prefix[1] >= 0 &&
											prefix[2] <= 255 &&
											prefix[2] >= 0 &&
											prefix[3] <= 255 &&
											prefix[3] >= 0 &&
											prefix[4] <= 255 &&
											prefix[4] >= 0
										) {
											return Promise.resolve();
										} else
											return Promise.reject(
												new Error(
													'Please match an IP/Subnet pattern or *!'
												)
											);
									},
							  }
							: {},
						dataIndex === 'action'
							? {
									pattern: /^(allow|block)$/,
									message: `Action is either "allow" or "block"!`,
							  }
							: {},
						dataIndex === 'port'
							? {
									pattern: /^((\d+)|\*)$/,
									message: `Port is either a number or *!`,
							  }
							: {},
					]}
				>
					{inputNode}
				</Form.Item>
			) : (
				children
			)}
		</td>
	);
};

const ConfigurationEditor = () => {
	const [form] = Form.useForm();
	const [rules, setRules] = useState([]);
	const [editingKey, setEditingKey] = useState('');
	const [tempRule, setTempRule] = useState(false);

	Renderer.on(
		'firewall-configuration-getter-reply',
		(event: IpcRendererEvent, data: Array<any>) => setRules(data)
	);

	useEffect(() => {
		Renderer.send('firewall-configuration-getter');
	}, []);

	useEffect(() => {
		Renderer.send('firewall-configuration-setter', ...rules);
	}, [rules]);

	const isEditing = (record: Item) => record.key === editingKey;

	const edit = (record: Partial<Item> & { key: React.Key }) => {
		form.setFieldsValue({
			action: '',
			prefix: '',
			port: '',
			modifier: '',
			...record,
		});
		setEditingKey(record.key);
	};

	const cancel = () => {
		if (tempRule) {
			setRules(rules.slice(0, rules.length - 1));
			setTempRule(false);
		}
		setEditingKey('');
	};

	const deleteRule = async (key: React.Key) => {
		const newRules = rules.filter((rule) => rule.key !== key);
		setRules(newRules);
		setEditingKey('');
	};

	const save = async (key: React.Key) => {
		try {
			const row = (await form.validateFields()) as Item;
			const newData = [...rules];
			const index = newData.findIndex((item) => key === item.key);
			if (index > -1) {
				const item = newData[index];
				newData.splice(index, 1, {
					...item,
					...row,
				});
				setRules(newData);
				setEditingKey('');
				setTempRule(false);
			} else {
				newData.push(row);
				setRules(newData);
				setEditingKey('');
				setTempRule(false);
			}
		} catch (errInfo) {
			console.log('Validate Failed:', errInfo);
		}
	};

	const columns = [
		{
			title: 'Action',
			dataIndex: 'action',
			width: '20%',
			editable: true,
		},
		{
			title: 'Prefix',
			dataIndex: 'prefix',
			width: '40%',
			editable: true,
		},
		{
			title: 'Port',
			dataIndex: 'port',
			width: '20%',
			editable: true,
		},
		{
			title: 'Modifier',
			dataIndex: 'modifier',
			width: '15%',
			editable: true,
		},
		{
			title: 'Operation',
			dataIndex: 'operation',
			width: '15%',
			render: (_: any, record: Item) => {
				const editable = isEditing(record);
				return editable ? (
					<span>
						<Typography.Link
							style={{ marginRight: 8 }}
							onClick={() => save(record.key)}
						>
							Save
						</Typography.Link>
						<Popconfirm title="Sure to cancel?" onConfirm={cancel}>
							<a style={{ marginRight: 8 }}>Cancel</a>
						</Popconfirm>
						<Popconfirm
							title="Sure to delete?"
							onConfirm={() => deleteRule(record.key)}
						>
							<a style={{ color: 'red' }}>Delete</a>
						</Popconfirm>
					</span>
				) : (
					<Typography.Link
						disabled={editingKey !== ''}
						onClick={() => edit(record)}
					>
						Edit
					</Typography.Link>
				);
			},
		},
	];

	const mergedColumns = columns.map((col) => {
		if (!col.editable) return col;
		return {
			...col,
			onCell: (record: Item) => ({
				record,
				inputType: 'text',
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record),
			}),
		};
	});

	return (
		<Form form={form} component={false}>
			<Table
				components={{ body: { cell: EditableCell } }}
				dataSource={rules}
				columns={mergedColumns}
				rowClassName="editable-row"
				pagination={false}
				scroll={{ y: 500 }}
				// pagination={{ onChange: cancel }}
			/>
			<br />
			<Button
				onClick={() => {
					const newRule = {
						key: `${rules.length}`,
						action: '',
						prefix: '',
						port: 0,
						modifier: '',
					};
					setTempRule(true);
					setRules([...rules, newRule]);
					edit(newRule);
				}}
			>
				Add
			</Button>
		</Form>
	);
};

export default ConfigurationEditor;
