# Example Extractor

> Extract documentation examples from real source code

[![Build + test](https://github.com/case-contract-testing/example-extractor/actions/workflows/build-and-test.yml/badge.svg)](https://github.com/case-contract-testing/example-extractor/actions/workflows/build-and-test.yml)
[![npm](https://img.shields.io/npm/v/example-extractor.svg)](https://www.npmjs.com/package/example-extractor)

## Overview

`example-extractor` is a command-line interface (CLI) tool designed to extract documentation examples directly from source files. This tool helps you automate the process of collecting code examples, making it easier to generate documentation or create educational material.

Do you want the examples in your documentation to be compiled and run as part of your regular tests, but don't want to include the whole file directly in your documentation? `example-extractor` is for you!

## How it works

`example-extractor` will recursively scan your source, looking for examples in
source files marked with special comments. These are extracted to markdown files
in an output folder.

### Marking Examples in Source Files

To mark an example in your source files, use the following comment format:

- **Start of the example:**  
  `// example-extract [example-name]`

- **End of the example:**  
  `// end-example`

(If you prefer, you can also use `/** example extract [example-name] */`)

### Example

Here's an example of how to mark a code example in a TypeScript file:

```typescript
// example-extract array-sum
function sumArray(arr: number[]): number {
  return arr.reduce((sum, current) => sum + current, 0);
}
// end-example
```

In this case, the tool will extract the code between the `example-extract array-sum` and `end-example` comments and save it under the name `array-sum.mdx`, complete with backticks and language hint for syntax highlighting:

````markdown name=
```ts
function sumArray(arr: number[]): number {
  return arr.reduce((sum, current) => sum + current, 0);
}
```
````

### Example Usage in Source Files

You can have multiple examples in your source files. Each example should have a unique name:

```typescript
// example-extract array-sum
function sumArray(arr: number[]): number {
  return arr.reduce((sum, current) => sum + current, 0);
}
// end-example

// example-extract array-max
function maxArray(arr: number[]): number {
  return Math.max(...arr);
}
// end-example
```

By using `example-extractor`, you can easily maintain and manage code examples for documentation purposes, ensuring that your examples are always up-to-date with your source code.

### Clearing the examples directory

Since we want the examples to be fresh each time, example-extractor expects an empty directory. To help you remember this, it will fail if it tries to overwrite an example.

We recommend clearing out your examples directory each time using something like [rimraf](https://www.npmjs.com/package/rimraf).

## Usage

```sh
example-extractor [options]
```

## Options

- `-i, --input <path>`  
  Base path to recursively search source files.  
  **Default:** `"."`

- `-o, --output <path>`  
  Base path where extracted examples will be written.  
  **Default:** `"extracted-examples"`

- `-e, --extensions [extension...]`  
  Extensions for the files to read examples from.  
  **Default:** `[".ts", ".java"]`

- `-x, --exclude-endings [ending...]`  
  Exclude source files that end with these extensions.  
  **Default:** `[".d.ts"]`

- `-l, --log-level <level>`  
  Set log level to one of `'debug'`, `'warn'`, `'error'`, `'info'`, `'none'`.  
  **Default:** `"info"`

- `-V, --version`  
  Output the version number.

- `-h, --help`  
  Display help for the command.

## Examples

1. **Basic usage with default settings:**

   ```sh
   example-extractor
   ```

2. **Specify input and output paths:**

   ```sh
   example-extractor -i src -o docs/examples
   ```

3. **Define file extensions to include and exclude:**

   ```sh
   example-extractor -e .js .jsx -x .test.js .spec.js
   ```

4. **Set log level to debug:**

   ```sh
   # You can use this if you're not getting the output you expect
   example-extractor -l debug
   ```

## Future features

Currently, only markdown output is supported, and comments must be in `//` or
`/* */` or `/** */` blocks. It would be easy to extend to other languages.
Additionally, we'd like to release a docusaurus component making it easy to roll
up these examples directly into your documentation.

## License

This project is licensed under the BSD 3 Clause License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request if you have improvement suggestions.

## Contact

For any questions or feedback, please [open an issue](https://github.com/case-contract-testing/example-extractor/issues)

---

Developed by [Timothy Jones](https://github.com/TimothyJones), as part of making maintenance for the ContractCase test suite easier. If this is useful to you, please consider [becoming a sponsor](https://github.com/sponsors/TimothyJones).
