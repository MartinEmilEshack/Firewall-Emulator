import { ipcMain, IpcMainEvent } from 'electron';
import { MainEventHandler } from 'src/models/EventHandler';
import {
	DataBroadcast,
	DummyHandler,
	GlobalDataSetter,
} from './event_handlers/MainEventHandlers';

export class EventRegister {
	constructor(events: Array<Array<any>>) {
		events.forEach((eventHandler) =>
			this.eventHandlers.set(eventHandler[0], eventHandler[1])
		);
	}

	private EventExist: MainEventHandler = (
		event: IpcMainEvent,
		eventChannel
	) => {
		event.returnValue = this.eventHandlers.has(eventChannel);
		if (event.returnValue)
			console.error(
				'Unregistered event {' +
					eventChannel +
					"}, check you're spelling or add it in the src/controllers/EventRegister.matchEventHandlers as ['event-channel', EventHandler],"
			);
	};

	private eventHandlers = new Map<
		string,
		MainEventHandler | MainEventHandler[]
	>([
		['check-event-existence', this.EventExist],
		['global-data-setter', GlobalDataSetter],
		['button-click', DummyHandler],
		['data-broadcast', DataBroadcast],
	]);

	register(): void {
		this.eventHandlers.forEach((handler, eventChannel, map): void => {
			if (Array.isArray(handler))
				handler.forEach((eventHandler) =>
					ipcMain.on(eventChannel, eventHandler)
				);
			else ipcMain.on(eventChannel, handler);
		});
	}
}
