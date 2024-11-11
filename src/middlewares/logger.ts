import { Express } from "express";
import morgan from "morgan";
import winston, { Logger } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

export let logger: Logger;

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

const fileTransports = () => {
  if (process.env.NODE_ENV === "production") {
    return [
      new DailyRotateFile({
        filename: "error-%DATE%.log",
        dirname: "logs",
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxFiles: "14d",
        level: "error",
      }),
      new DailyRotateFile({
        filename: "application-%DATE%.log",
        dirname: "logs",
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxFiles: "14d",
      }),
    ];
  }

  return [];
};

/**
 * Initialize the logger and setup Morgan to log HTTP requests.
 *
 * @param app - The Express app.
 */
export const initializeLogger = (app: Express) => {
  winston.addColors(colors);

  logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "http" : "debug",
    levels,
    transports: [
      new winston.transports.Stream({
        stream: process.stderr,
        level: "debug",
      }),
      ...fileTransports(),
    ],
    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
      winston.format.colorize({ all: true }),
      winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
      )
    ),
  });

  app.use(
    morgan(
      ":remote-addr :method :url :status :res[content-length] - :response-time ms",
      {
        stream: {
          write: (message) => logger.http(message),
        },
      }
    )
  );
};
