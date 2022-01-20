import oTools from '@osmium/tools';
import {SchemaType} from './types';
import {existsSync} from 'fs';

export class Config {

	private readonly config: any;

	constructor(configPath: string | undefined, schema: SchemaType) {
		let configFileData = {};

		if (configPath && existsSync(configPath)) {
			configFileData = require(configPath);
		}

		this.config = this.processConfig(schema(this.defineConfig), configFileData);
	}

	get() {
		return this.config;
	}

	private defineConfig<T>(envName: string, defValue: T): T {
		const _parseEnvValue = (data: any): any => {
			switch (typeof defValue) {
				case 'number':
					return parseFloat(data);
				case 'boolean':
					return data.toLowerCase().indexOf('true') !== -1;
				case 'object':
					return JSON.parse(data);
				case 'string':
					return data;
				default:
					return data;
			}
		};

		const envVal = process.env[envName];

		return (envVal !== undefined ? _parseEnvValue(envVal) : defValue);
	}

	private processConfig(struct: any, obj: object) {
		return oTools.iterate(struct, (val, idx) => {
			if (oTools.isObject(val)) return this.processConfig(val, obj[idx] === undefined ? {} : obj[idx]);

			return obj ? obj[idx] !== undefined ? obj[idx] : val : val;
		}, {});
	}
}
