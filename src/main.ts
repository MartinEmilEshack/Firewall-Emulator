import {
	app,
	BrowserWindow,
	ipcMain,
	IpcMainEvent,
} from 'electron';
import { EventRegister } from './controllers/EventRegister';
import { FirewallConfigration } from './controllers/FirewallConfigration.js';
import { FirewallSniffer } from './controllers/FirewallSniffer.js';
import { MainEventHandler } from './models/EventHandler';

class Firewall {

	eventRegistry: EventRegister = null;
	firewallConfig: any = null;
	firewallSniffer: any = null;

	public static main() {
		const application: Firewall = new Firewall();
		app.whenReady()
			.then(application.start)
			.catch((reason: any) => {
				console.log(reason);
			});
		app.on('window-all-closed', application.quit);
		app.on('activate', application.activate);
		application.eventRegistry = new EventRegister([
			['firewall-packets-getter', application.FirewallPacketsGetter],
			['firewall-configuration-getter', application.FirewallConfigurationGetter],
			['firewall-configuration-setter', application.FirewallConfigurationSetter],
		]);
		application.eventRegistry.register();
		application.firewallConfig = new FirewallConfigration()
		application.firewallSniffer = new FirewallSniffer(application.firewallConfig);
	}

	private start() {
		const renderer: BrowserWindow = new BrowserWindow({
			width: 800,
			height: 600,
			webPreferences: {
				nodeIntegration: true,
			},
		});
		renderer.loadFile('index.html');
		renderer.maximize();
		// renderer.webContents.openDevTools();
		renderer.removeMenu();
	}

	private activate() {
		if (BrowserWindow.getAllWindows().length === 0) this.start();
	}

	private quit() {
		if (process.platform !== 'darwin') app.quit();
	}

	private FirewallPacketsGetter: MainEventHandler = async (event: IpcMainEvent,...data: any[]) => {
		let packets = {
			matched: this.firewallSniffer.matchedPackets,
			neglected: this.firewallSniffer.neglectedPackets,
		};
		event.reply('firewall-packets-getter-reply', packets);
	};

	private FirewallConfigurationGetter: MainEventHandler = async (event: IpcMainEvent,...data: any[]) => {
		const rules = this.firewallConfig.getConfigurations().map(
			(rule: Object, index: number) => {return {...rule,key: `${index}`,}}
		);
		event.reply('firewall-configuration-getter-reply', rules);
	};
	
	private FirewallConfigurationSetter: MainEventHandler = async (event: IpcMainEvent,data: any[]) => {
		this.firewallConfig.updateConfigurations(data)
	};
}

Firewall.main();