import { IpcMainEvent } from 'electron';
import { MainEventHandler } from 'src/models/EventHandler';

export const DataBroadcast: MainEventHandler = async (
	event: IpcMainEvent,
	...data: any[]
) => event.reply('data-broadcast-reply', data);

export const GlobalDataSetter: MainEventHandler = async (
	event: IpcMainEvent,
	...data: any[]
) => {
	let globalData = {
		library_dir: '/media/martin/Sand Box/Beloghos/Beloghos Radio/Library',
		theme: 'dark',
	};
	event.reply('global-data-reply', globalData);
};

export const DummyHandler: MainEventHandler = (
	event: IpcMainEvent,
	...data: any[]
) => {
	event.returnValue = 'request handeled';
};

export const AsyncDummyHandler: MainEventHandler = async (
	event: IpcMainEvent,
	...args: any[]
) => {
	event.reply('shit-reply', 'async request handeled');
};
