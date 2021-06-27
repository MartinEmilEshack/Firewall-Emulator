// import { createServer, Server } from 'net';
const { createServer } = require('net');

class FirewallSniffer {
	constructor(firewallConfig) {
		this.firewallConfig = firewallConfig;
		this.matchedPackets = [];
		this.neglectedPackets = [];
		this.server = createServer((socket) => {
			socket.on('data', (buffer) => this.sniff(JSON.parse(buffer.toString('utf-8'))));
			// console.log(this.matchedPackets.length, this.neglectedPackets.length);
		});
		this.server.listen(4040);
		console.log("Server is listening..");
	}

	sniff(packet) {
		const rules = this.firewallConfig.getConfigurations();
		const passed = rules.filter((rule) => {
			const prefixMatch = rule.prefix === '*' || this.matchPrefix(rule.prefix, packet.sourceIP);
			const portMatch = rule.port === '*' || rule.port === packet.sourcePort;
			const modifierMatch =
				rule.modifier === '' ? true :
					(rule.modifier === 'established' && packet.flag === 'continue');
			// console.log(prefixMatch, portMatch, modifierMatch);
			return prefixMatch && portMatch && modifierMatch;
		});
		if (passed.length) this.matchedPackets.push(
			{
				...packet,
				action: passed[0].action,
				rule: rules.indexOf(passed[0]) + 1,
				key: `${this.matchedPackets.length}`,
			}
		);
		else this.neglectedPackets.push({
			...packet,
			key: `${this.neglectedPackets.length}`,
		});
	}

	matchPrefix(prefix, ipAdress) {
		const packetIP = this.ipToBinary(ipAdress);
		let [ruleIP, ruleSubnet] = prefix.split('/');
		ruleIP = this.ipToBinary(ruleIP);
		ruleSubnet = this.subnetToBinary(ruleSubnet);
		return (packetIP & ruleSubnet) == ruleIP;
	}

	ipToBinary(IPaddress) {
		var ip = IPaddress.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
		if (ip) return (+ip[1] << 24) + (+ip[2] << 16) + (+ip[3] << 8) + (+ip[4]);
		return IPaddress;
	}

	subnetToBinary(maskSize) {
		return -1 << (32 - maskSize);
	}

}

module.exports = { FirewallSniffer };

// export default Firewall;
