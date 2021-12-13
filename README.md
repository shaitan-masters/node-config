# Common Config

##### Install

```npm i @shaitan-masters/config```

or 

```yarn add @shaitan-masters/config```

------------

##### Usage

```typescript
import {Config} from '@shaitan-masters/config';

export interface AppConfig {
	api: {
		apiUrl: string;
		authorization: {
			apikey: string;
		}
	};
	redis: {
		host: string;
		password: string;
		port: number;
		channels: {
			websockets: string
		}
	};
}

const configStruct = new Config('./config.js', (defineConfig) => ({
	api  : {
		apiUrl       : defineConfig<string>('API_URL', 'https://example.com'),
		authorization: {
			apikey: defineConfig<string>('apikey', '123456')
		}
	},
	redis: {
		host    : defineConfig<string>('REDIS_HOST', 'localhost'),
		password: defineConfig<string>('REDIS_PASSWORD', 'secret'),
		port    : defineConfig<number>('REDIS_PORT', 6379),
		channels: {
			websockets: defineConfig<string>('REDIS_CHANNELS_WEBSOCKETS', 'channel42')
		}
	}
}));

const config = configStruct.get();
console.log(config);

// {
// 	api: {
// 		apiUrl: 'https://example.com',
// 		authorization: { apikey: '123456' }
// 	},
// 	redis: {
// 		host: 'localhost',
// 		password: 'secret',
// 		port: 6379,
// 		channels: { websockets: 'channel42' }
// 	}
// }
```
