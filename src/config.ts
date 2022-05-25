import oTools from '@osmium/tools';

export type SchemaDefine<K> = (cb: <T>(envName: string, defValue: T) => T) => K;
export type DeepPartial<T> = T extends object ? {
	[P in keyof T]?: DeepPartial<T[P]>;
} : T;

export class Config<SchemaType extends { [key: string | number]: any }> {
	private readonly config: SchemaType;

	constructor(schema: SchemaDefine<SchemaType> = () => ({} as SchemaType), configOverride?: DeepPartial<SchemaType>) {
		this.config = this.processConfig(schema(this.defineConfig), configOverride || {} as DeepPartial<SchemaType>);
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

	private processConfig(struct: SchemaType, obj: DeepPartial<SchemaType>) {
		return oTools.iterate(struct, (val, idx) => {
			if (oTools.isObject(val)) return this.processConfig(val, obj[idx] === undefined ? {} : obj[idx]);

			return obj ? obj[idx] !== undefined ? obj[idx] : val : val;
		}, {});
	}
}
