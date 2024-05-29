import { logger } from '../entities/logger.js';
import { Example, ExampleLocation } from './types.js';

const START_REGEX = /^\s*(\/\/|\/\*|\*|\*\/)\s*example-extract\s*(\w+.\w+)?/;
const END_REGEX = /^\s*(\/\/|\/\*|\*|\*\/)\s*end-example/;

// example-extract partial-example
interface PartialExample {
  name: string;
  lines: string[];
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
      } else {
        partialExample.lines.push(line);
      }
    }
  });
  // end-example
  if (sections.length === 0) {
    logger.debug(`No example sections in ${context.fullPath}`);
  } else {
    logger.debug(`Successfully read ${sections.length} sections`, sections);
  }

  return sections;
};
