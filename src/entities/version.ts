import { readPackageUpSync } from 'read-package-up';

const maybePackageJson = readPackageUpSync();

export const version: string = maybePackageJson
  ? maybePackageJson.packageJson.version
  : 'UNKNOWN VERSION OF EXAMPLE EXTRACTOR';

export const nameAndVersion = maybePackageJson
  ? `${maybePackageJson.packageJson.name}@${maybePackageJson.packageJson.version}`
  : 'UNKNOWN VERSION OF EXAMPLE EXTRACTOR';
