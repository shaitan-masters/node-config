"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const tools_1 = __importDefault(require("@osmium/tools"));
class Config {
    config;
    constructor(configPath, schema) {
        let configFileData = {};
        if (configPath) {
            try {
                configFileData = require(configPath);
                console.log(configFileData);
            }
            catch (error) {
                console.log(error);
            }
        }
        this.config = this.processConfig(schema(this.defineConfig), configFileData);
    }
    get() {
        return this.config;
    }
    defineConfig(envName, defValue) {
        const _parseEnvValue = (data) => {
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
    processConfig(struct, obj) {
        return tools_1.default.iterate(struct, (val, idx) => {
            if (tools_1.default.isObject(val))
                return this.processConfig(val, obj[idx] === undefined ? {} : obj[idx]);
            return obj ? obj[idx] !== undefined ? obj[idx] : val : val;
        }, {});
    }
}
exports.Config = Config;
//# sourceMappingURL=config.js.map