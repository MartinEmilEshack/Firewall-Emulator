const net = require('net');

const client = new net.Socket();

const randomPacket = () => {
	return {
		sourceIP: randomIP(),
		destIP: randomIP(),
		sourcePort: randomPort(),
		destPort: randomPort(),
		flag: randomFlag()
	};
};

const randomFlag = () => {
	const flags = ['start', 'continue', 'end'];
	return flags[Math.floor(Math.random() * (2 - 0 + 1)) + 0];
};

const randomIP = () => {
	const first = Math.floor(Math.random() * (255 - 0 + 1)) + 0;
	const second = Math.floor(Math.random() * (255 - 0 + 1)) + 0;
	const third = Math.floor(Math.random() * (255 - 0 + 1)) + 0;
	const forth = Math.floor(Math.random() * (255 - 0 + 1)) + 0;
	return `${first}.${second}.${third}.${forth}`;
};

const randomPort = () => {
	return `${Math.floor(Math.random() * (49151 - 0 + 1)) + 0}`;
};

const repeater = setInterval(() => {
	client.connect(4040, 'localhost', () => console.log('Connected to server'));
	client.end(JSON.stringify(randomPacket()));
}, 1000);