#!/usr/bin/env node

import { main } from './dist/src/index.js';

const rootPath = '.';
main({ searchPath: rootPath, outputBasePath: 'output' });
