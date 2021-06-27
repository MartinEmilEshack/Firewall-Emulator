import { IpcMainEvent } from 'electron';
import { IpcRendererEvent } from 'electron';

export type MainEventHandler = (event: IpcMainEvent, ...args: any[]) => void;
export type RenderEventHandler = (
	event: IpcRendererEvent,
	...args: any[]
) => void;
