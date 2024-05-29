import { filesystem } from './connectors/index.js';
import {
  createFileContentsVisitor,
  createFilteringVisitor,
} from './connectors/filesystemVisitor.js';
import { createFilesystemWriter } from './connectors/filesystemWriter.js';
import { extractExampleSections } from './domain/exampleExtractor.js';
import { printMarkdown } from './domain/examplePrinter.js';
import { ExtractorError } from './entities/ExtractorError.js';
import { logger, setLogLevel } from './entities/logger.js';
import { Config } from './config.js';

export const extract = (config: Config): void => {
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
