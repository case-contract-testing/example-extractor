export interface ExampleLocation {
  basename: string;
  filename: string;
  extension: string;
  fullPath: string;
}

export interface StringVisitor {
  (contents: string, context: ExampleLocation): void;
}

export interface Example {
  name: string;
  contents: string;
  context: ExampleLocation;
}

export interface Extractor {
  (source: string, context: ExampleLocation): Example[];
}

export interface Printer {
  format: (example: Example) => string;
  extension: string;
}
