import * as React from 'react';
import { ipcRenderer } from 'electron';
import { RenderEventHandler } from 'src/models/EventHandler';

export class Renderer {
	private static requester: Renderer = null;

	static sendSync(eventChannel: string, ...data: any[]) {
		if (!Renderer.requester) Renderer.requester = new Renderer();
		if (Renderer.requester.checkEvent(eventChannel))
			return ipcRenderer.sendSync(eventChannel, data);
		else
			console.error(
				'Unregistered event {' +
					eventChannel +
					"}, check you're spelling or add it in the src/controllers/EventRegister.matchEventHandlers as ['event-channel', EventHandler],"
			);
	}

	static send(eventChannel: string, ...data: any[]) {
		if (!Renderer.requester) Renderer.requester = new Renderer();
		if (Renderer.requester.checkEvent(eventChannel))
			ipcRenderer.send(eventChannel, data);
		else
			console.error(
				'Unregistered event {' +
					eventChannel +
					"}, check you're spelling or add it in the src/controllers/EventRegister.matchEventHandlers as ['event-channel', EventHandler],"
			);
	}

	static on(eventChannel: string, handler: RenderEventHandler) {
		// assign the event handler once
		React.useEffect(() => {
			ipcRenderer.on(eventChannel, handler);
		}, [eventChannel, handler]);
	}

	private checkEvent(eventChannel: string) {
		return ipcRenderer.sendSync('check-event-existence', eventChannel);
	}
}
