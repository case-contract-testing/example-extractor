import { Console } from 'node:console';
import chalk from 'chalk';
import { nameAndVersion } from './version.js';
import { ExtractorError } from './ExtractorError.js';

const stdout = new Console({ stdout: process.stdout });

export type LogLevel = 'none' | 'error' | 'warn' | 'debug' | 'info';

let currentLevel: LogLevel = 'debug';

export const ALL_LOG_LEVELS: Record<LogLevel, boolean> = {
  none: true,
  error: true,
  warn: true,
  debug: true,
  info: true,
};

export interface Logger {
  /**
   * Information about normal operation
   */
  info: (message: string, ...additional: unknown[]) => void;
  /**
   * It seems likely that there is a misconfiguration
   */
  warn: (message: string, ...additional: unknown[]) => void;
  /**
   * Something has gone wrong during execution
   */
  error: (message: string, ...additional: unknown[]) => void;
  /**
   * Information to help users find out what is happening during execution
   */
  debug: (message: string, ...additional: unknown[]) => void;
}

const getColours = (level: LogLevel) => {
  if (level === 'warn') {
    return {
      typeColour: chalk.yellowBright,
      messageColour: chalk.yellowBright,
    };
  }
  if (level === 'error') {
    return { typeColour: chalk.redBright, messageColour: chalk.redBright };
  }
  if (level === 'debug') {
    return {
      typeColour: chalk.cyan,
      messageColour: chalk.cyan,
    };
  }
  return { typeColour: chalk.green, messageColour: chalk.white };
};

const formatMessage = (level: LogLevel, message: string) => {
  const { typeColour, messageColour } = getColours(level);
  return `${chalk.whiteBright(nameAndVersion)} ${typeColour(
    level.toUpperCase(),
  )}: ${messageColour(message)}`;
};

const printToConsole = (formattedMessage: string, additional: unknown[]) => {
  if (additional && additional.length > 0) {
    stdout.log(formattedMessage, ...additional);
  } else {
    stdout.log(formattedMessage);
  }
};

const printLog = (level: LogLevel, message: string, ...additional: unknown[]) =>
  printToConsole(formatMessage(level, message), additional);

export const logger: Logger = {
  debug: (message: string, ...additional: unknown[]): void => {
    if (
      currentLevel !== 'none' &&
      currentLevel !== 'error' &&
      currentLevel !== 'warn' &&
      currentLevel !== 'info'
    ) {
      printLog('debug', message, ...additional);
    }
  },
  info: (message: string, ...additional: unknown[]): void => {
    if (
      currentLevel !== 'none' &&
      currentLevel !== 'error' &&
      currentLevel !== 'warn'
    ) {
      printLog('info', message, ...additional);
    }
  },
  warn: (message: string, ...additional: unknown[]): void => {
    if (currentLevel !== 'none' && currentLevel !== 'error') {
      printLog('warn', message, ...additional);
    }
  },
  error: (message: string, ...additional: unknown[]) => {
    if (currentLevel !== 'none') {
      printLog('error', message, ...additional);
    }
  },
};

export const setLogLevel = (printableLevel: LogLevel): void => {
  const newLevel = printableLevel.toLowerCase() as LogLevel;
  if (!ALL_LOG_LEVELS[newLevel]) {
    logger.error(
      `The log level '${printableLevel}' is not a valid log level. Please use one of: ${Object.keys(ALL_LOG_LEVELS).join(', ')}`,
    );
    throw new ExtractorError(`Invalid log level specified: ${printableLevel}`);
  }
  currentLevel = newLevel;
};
