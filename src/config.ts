import oTools from '@osmium/tools';
import {existsSync} from 'fs';

export type SchemaDefine<K> = (cb: <T>(envName: string, defValue: T) => T) => K;

export class Config<SchemaType> {
	private readonly config: SchemaType;

	constructor(configPath: string | undefined = undefined, schema: SchemaDefine<SchemaType> = () => ({} as SchemaType)) {
		let configFileData = {};

		if (configPath && existsSync(configPath)) {
			configFileData = require(configPath);
		}

		this.config = this.processConfig(schema(this.defineConfig), configFileData);
	}

	get(): SchemaType {
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
