import * as path from 'node:path';
import * as fs from 'node:fs';
import sanitize from 'sanitize-filename';
import { mkdirp } from 'mkdirp';
import {
  Example,
  ExampleLocation,
  Extractor,
  Printer,
  StringVisitor,
} from '../domain/types.js';
import { logger } from '../entities/logger.js';
import { ExtractorError } from '../entities/ExtractorError.js';

const writeFileExclusive = (
  filePath: string,
  content: string,
  context: ExampleLocation,
): void => {
  if (fs.existsSync(filePath)) {
    logger.error(`${context.fullPath}: Tried to overwrite an existing example (${filePath}) 
       * Check that there are not two examples with the same name. You can rerun with debug logging to find the other example
       * Make sure you clear the output directory before each run
    `);
    throw new ExtractorError(
      `${context.fullPath}: Tried to overwrite an existing example (${filePath})`,
    );
  }

  mkdirp.sync(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
  logger.info(`Wrote example: ${filePath} (from ${context.filename})`);
};

const cleanName = (example: Example, printer: Printer) => {
  const extension = `${example.context.extension}${printer.extension.startsWith('.') ? '' : '.'}${printer.extension}`;
  const sanitisedName = sanitize(`${example.name}${extension}`);
  if (sanitisedName === extension) {
    const message = `${example.context.fullPath}: After sanitisation, the example named '${sanitisedName}' was an empty string. You will need to rename it`;
    logger.error(message);
    throw new ExtractorError(message);
  }
  return sanitisedName;
};

export const createFilesystemWriter =
  (
    outputBasePath: string,
    extractor: Extractor,
    printer: Printer,
  ): StringVisitor =>
  (source: string, context: ExampleLocation): void => {
    extractor(source, context).forEach((example) => {
      const outputFullPath = path.join(
        outputBasePath,
        cleanName(example, printer),
      );
      writeFileExclusive(outputFullPath, printer.format(example), context);
    });
  };
