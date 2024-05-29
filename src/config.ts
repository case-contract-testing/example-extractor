import { LogLevel } from './entities/logger.js';

export interface Config {
  searchPath: string;
  outputBasePath: string;
  includeExtensions: string[];
  excludeEndings: string[];
  logLevel: LogLevel;
}

export const defaultConfig: Config = {
  searchPath: '.',
  outputBasePath: 'extracted-examples',
  includeExtensions: ['.ts', '.java'],
  excludeEndings: ['.d.ts'],
  logLevel: 'info',
};
