import { Example, Printer } from './types.js';

export const printMarkdown: Printer = {
  format: (example: Example): string =>
    `\`\`\`${example.context.extension.replace('.', '')}\n${example.contents}\n\`\`\`\n`,
  extension: 'mdx',
};
