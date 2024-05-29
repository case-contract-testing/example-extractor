import { filesystem } from './connectors/index.js';
import {
  createFileContentsVisitor,
  createFilteringVisitor,
} from './connectors/filesystemVisitor.js';
import { createFilesystemWriter } from './connectors/filesystemWriter.js';
import { extractExampleSections } from './domain/exampleExtractor.js';
import { printMarkdown } from './domain/examplePrinter.js';
import { ExtractorError } from './entities/ExtractorError.js';
import { LogLevel, logger, setLogLevel } from './entities/logger.js';

interface Config {
  searchPath: string;
  outputBasePath: string;
  includeExtensions: string[];
  excludeEndings: string[];
  logLevel: LogLevel;
}

const defaultConfig: Config = {
  searchPath: '.',
  outputBasePath: 'extracted-examples',
  includeExtensions: ['.ts', '.java'],
  excludeEndings: ['.d.ts'],
  logLevel: 'info',
};

export const main = (suppliedConfig: Partial<Config>): void => {
  const config: Config = { ...defaultConfig, ...suppliedConfig };
  setLogLevel(config.logLevel);
  try {
    filesystem.traverseDirectory(
      config.searchPath,
      createFilteringVisitor(
        config.includeExtensions,
        config.excludeEndings,
        createFileContentsVisitor(
          createFilesystemWriter(
            config.outputBasePath,
            extractExampleSections,
            printMarkdown,
          ),
        ),
      ),
    );
  } catch (err) {
    if (err instanceof ExtractorError) {
      logger.debug('Caught ExtractorError', err);
      process.exit(1);
    }
    logger.error(`Unexpected Error: ${(err as Error).message}`, err);
    throw err;
  }
};
