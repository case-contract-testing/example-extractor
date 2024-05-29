import { program } from 'commander';
import { defaultConfig } from './config.js';
import { version } from './entities/version.js';
import { extract } from './extract.js';

export const cli = (): void => {
  program
    .name('example-extractor')
    .requiredOption(
      '-i, --input',
      'Base path to recursively search source files',
      (t) => t,
      defaultConfig.searchPath,
    )
    .requiredOption(
      '-o, --output',
      'Base path where extracted examples will be written',
      defaultConfig.outputBasePath,
    )
    .requiredOption(
      '-e, --extensions [extension...]',
      'Extensions for the files to read examples from',
      defaultConfig.includeExtensions,
    )
    .requiredOption(
      '-x, --exclude-endings [ending...]',
      'Exclude source files that end with these extensions',
      defaultConfig.excludeEndings,
    )
    .requiredOption(
      '-l, --log-level',
      `Set log level to one of 'debug', 'warn', 'error', 'info', 'none'`,
      defaultConfig.logLevel,
    )
    .description(
      'CLI to extract documentation examples directly from source files',
    )
    .version(version);

  program.parse();

  const options = program.opts();

  extract({
    searchPath: options['input'],
    outputBasePath: options['output'],
    includeExtensions: options['extensions'],
    excludeEndings: options['excludeEndings'],
    logLevel: options['logLevel'],
  });
};
