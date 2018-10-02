import { Config } from './model';

const config: Config = {
    port: +process.env.NODE_PORT || 3000,
    dataDir: 'data'
};

export { config };
