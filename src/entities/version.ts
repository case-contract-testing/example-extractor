import packageJson from '../../package.json' with { type: 'json' };

export const version: string = `${packageJson.name ?? 'Unknown-Package'}@${packageJson.version ?? 'Unknown-Version'}`;
