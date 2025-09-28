export type LogLevel = "info" | "success" | "warn" | "error" | "debug";

const levels = ["debug", "info", "success", "warn", "error"] as const;

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  fg: {
    blue: "\x1b[34m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
  },
};

const levelColors: Record<LogLevel, string> = {
  info: colors.fg.blue,
  success: colors.fg.green,
  warn: colors.fg.yellow,
  error: colors.fg.red,
  debug: colors.fg.magenta,
};

const shouldLog = (currentLevel: LogLevel, logLevel: LogLevel): boolean => {
  return levels.indexOf(logLevel) >= levels.indexOf(currentLevel);
};

const formatMessage = (
  level: LogLevel,
  message: string,
  prefix = "API",
): string => {
  const timestamp = new Date().toISOString();
  return `${colors.dim}${timestamp}${colors.reset} ${
    levelColors[level]
  }${level.toUpperCase()}${colors.reset} ${colors.bright}[${prefix}]:${colors.reset} ${message}`;
};

export interface LoggerOptions {
  level?: LogLevel;
  prefix?: string;
  disabled?: boolean;
}

export const createLogger = (options: LoggerOptions = {}) => {
  const { level = "info", prefix = "API", disabled = false } = options;

  const log = <T extends unknown[]>(
    logLevel: LogLevel,
    message: string,
    ...args: T
  ) => {
    if (disabled || !shouldLog(level, logLevel)) return;

    const formatted = formatMessage(logLevel, message, prefix);

    if (logLevel === "error") {
      console.error(formatted, ...args);
    } else if (logLevel === "warn") {
      console.warn(formatted, ...args);
    } else {
      console.log(formatted, ...args);
    }
  };

  return {
    info: <T extends unknown[]>(message: string, ...args: T) =>
      log("info", message, ...args),
    success: <T extends unknown[]>(message: string, ...args: T) =>
      log("success", message, ...args),
    warn: <T extends unknown[]>(message: string, ...args: T) =>
      log("warn", message, ...args),
    error: <T extends unknown[]>(message: string, ...args: T) =>
      log("error", message, ...args),
    debug: <T extends unknown[]>(message: string, ...args: T) =>
      log("debug", message, ...args),
  };
};

export const logger = createLogger();
export type AppLogger = ReturnType<typeof createLogger>;
