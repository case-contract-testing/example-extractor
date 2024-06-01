import { createRequire } from 'module';

const PackageJson = createRequire(import.meta.url)('../../package.json');

export const version: string =
  PackageJson.version ?? 'UNKNOWN VERSION OF EXAMPLE EXTRACTOR';

export const nameAndVersion =
  PackageJson.name != null
    ? `${PackageJson.name}@${version}`
    : 'UNKNOWN NAME OF EXAMPLE EXTRACTOR';
