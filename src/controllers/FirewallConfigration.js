const { readFileSync, writeFileSync } = require('fs');

class FirewallConfigration {
	constructor() {
		this.file = './assets/data/Firewall.config.json';
		const { rules } = JSON.parse(readFileSync(this.file).toString());
		this.rules = rules;
	}

	updateConfigurations(configurations) {
		this.rules = configurations.map((rule) => {
			const { key, ...rest } = rule;
			return { ...rest };
		});
		writeFileSync(this.file, JSON.stringify({ rules: this.rules }, null, 2,));
	}

	getConfigurations() {
		return this.rules;
	}
}

module.exports = { FirewallConfigration };