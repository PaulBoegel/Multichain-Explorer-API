const winston = require("winston");
const { format, config } = require("winston");
const { combine, timestamp, json } = format;

class LogHandler {
  static #INSTANTS;

  constructor(options) {
    if (typeof LogHandler.#INSTANTS === "object") return;
    LogHandler.#INSTANTS = new winston.createLogger({
      levels: config.syslog.levels,
      format: combine(
        timestamp({
          format: options.dateFormat,
        }),
        json()
      ),
      transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console),
      ],
      exitOnError: false,
    });
  }

  static info({ name, message }) {
    if (typeof LogHandler.#INSTANTS === "object")
      return LogHandler.#INSTANTS.info(name, message);

    throw new Error("logger not instantiated");
  }

  static error(message) {
    if (typeof LogHandler.#INSTANTS === "object")
      return LogHandler.#INSTANTS.error(message);

    throw new Error("logger not instantiated");
  }
}

module.exports = LogHandler;
