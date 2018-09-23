export interface Config {
    port: number;
    dataDir: string; // relative to /public
}

const config: Config = {
    port: +process.env.NODE_PORT || 3000,
    dataDir: 'data',
};

export {config};
