import { SchemaType } from './types';
export declare class Config {
    private readonly config;
    constructor(configPath: string, schema: SchemaType);
    get(): any;
    private defineConfig;
    private processConfig;
}
