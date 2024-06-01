import { logger } from '../entities/logger.js';
import { Example, ExampleLocation } from './types.js';

const START_REGEX = /^\s*(\/\/|\/\*|\*|\*\/)\s*example-extract\s*(\w+.\w+)?/;
const END_REGEX = /^\s*(\/\/|\/\*|\*|\*\/)\s*end-example/;
const START_IGNORE_REGEX = /^\s*(\/\/|\/\*|\*|\*\/)\s*ignore-extract/;
const END_IGNORE_REGEX = /^\s*(\/\/|\/\*|\*|\*\/)\s*end-ignore/;

// example-extract partial-example
interface PartialExample {
  // The name of this example
  name: string;
  // The lines of this example
  lines: string[];
  // Whether we're currently ignoring lines
  ignoring: boolean;
}
// end-example

// example-extract
/**
 * Extracts {@link ExampleSection} objects from a given string that represents a
 * source file.
 *
 * @param source - the source code to extract examples from
 * @returns an array of {@link ExampleSection} objects
 */
export const extractExampleSections = (
  source: string,
  context: ExampleLocation,
): Example[] => {
  const sections: Example[] = [];
  let count = 0;
  let partialExample: undefined | PartialExample;

  source.split('\n').forEach((line) => {
    const startMatch = START_REGEX.exec(line);

    if (partialExample === undefined && startMatch) {
      partialExample = {
        name: startMatch[2] || `${context.basename}-${count}`,
        lines: [],
        ignoring: false,
      };
      count += 1;
    } else if (partialExample !== undefined) {
      if (END_REGEX.exec(line)) {
        sections.push({
          name: partialExample.name,
          contents: partialExample.lines.join('\n'),
          context,
        });
        partialExample = undefined;
        return;
      }
      if (partialExample.ignoring) {
        if (END_IGNORE_REGEX.exec(line)) {
          partialExample.ignoring = false;
        }
      } else if (START_IGNORE_REGEX.exec(line)) {
        partialExample.ignoring = true;
      } else {
        partialExample.lines.push(line);
      }
    }
  });

  // An in-progress example is also terminated by the end of the file
  if (partialExample !== undefined) {
    sections.push({
      name: partialExample.name,
      contents: partialExample.lines.join('\n'),
      context,
    });
  }

  // end-example
  if (sections.length === 0) {
    logger.debug(`No example sections in ${context.fullPath}`);
  } else {
    logger.debug(`Successfully read ${sections.length} sections`, sections);
  }

  return sections;
};
