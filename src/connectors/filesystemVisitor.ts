import * as fs from 'node:fs';
import * as path from 'node:path';
import { StringVisitor } from '../domain/types.js';
import { logger } from '../entities/logger.js';
import { ExtractorError } from '../entities/ExtractorError.js';

interface FileVisitor {
  (fullPath: string): void;
}

const SKIP_PATHS_INCLUDING = ['node_modules', '.git'];

/**
 * Function to traverse the directory structure from a given path
 *
 * @param dirPath - Full path to the directory to start in
 * @param visit - A {@link FileVisitor} for processing the files
 */
export const traverseDirectory = (
  dirPath: string,
  visit: FileVisitor,
): void => {
  const skips = SKIP_PATHS_INCLUDING.filter((content) =>
    dirPath.includes(content),
  );
  if (skips.length !== 0) {
    logger.debug(`Skipping path: ${dirPath}, as it includes '${skips[1]}'`);
    return;
  }

  logger.debug(`Traverse: Entering directory: ${dirPath}`);

  fs.readdirSync(dirPath, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isFile()) {
      logger.debug(`Traverse: found file: ${fullPath}`);
      visit(fullPath);
    } else if (entry.isDirectory()) {
      logger.debug(`Traverse: found dir: ${fullPath}`);
      traverseDirectory(fullPath, visit);
    }
  });
};

/**
 * A file visitor that simply reads the contents of the file and passes them to
 * a string visitor.
 *
 * @param visitor - a {@link StringVisitor} to be passed the file contents
 * @returns a {@link FileVisitor} that reads the file contents and passes to the file path
 * @throws {@link Error} if there is an error reading the file
 */
export const createFileContentsVisitor =
  (visitor: StringVisitor): FileVisitor =>
  (filePath: string) => {
    fs.readFile(
      filePath,
      'utf8',
      (err: NodeJS.ErrnoException | null, fileContents: string) => {
        if (err) {
          logger.error(
            `Unable to read file contents: ${filePath}\n    (${err.name}: ${err.message})`,
          );
          throw new ExtractorError(`Error reading file ${filePath}:`, {
            cause: err,
          });
        }
        logger.debug(`Successfully read file contents: ${filePath}`);
        visitor(fileContents, {
          basename: path.basename(filePath, path.extname(filePath)),
          filename: path.basename(filePath),
          extension: path.extname(filePath),
          fullPath: filePath,
        });
      },
    );
  };

/**
 * Creates a file visitor that delegates to another {@link FileVisitor} only if the
 * visited file has one of the given extensions
 *
 * @param matchingExtensions - an array of extensions to match, eg `['.ts']`.
 * @param delegate - a {@link StringVisitor} to be passed the file contents
 * @returns a {@link FileVisitor} that delegates as described above
 */
export const createFilteringVisitor = (
  matchingExtensions: string[],
  ignoreEndsWith: string[],
  delegate: FileVisitor,
): FileVisitor => {
  const allExtensions = matchingExtensions.join(', ');

  return (filePath: string) => {
    const extension = path.extname(filePath);
    if (matchingExtensions.includes(extension)) {
      logger.debug(`Extension for '${filePath}' matches extensions`);
      if (
        ignoreEndsWith.find((ending) => filePath.endsWith(ending)) !== undefined
      ) {
        logger.debug(`Ending for '${filePath}' is ignored. Skipping`);
      }
      delegate(filePath);
    } else {
      logger.debug(
        `Skipping '${filePath}', as it doesn't match any [${allExtensions}]`,
      );
    }
  };
};
