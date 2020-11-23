const winston = require("winston");
const { format, config } = require("winston");
const { combine, timestamp, json } = format;

class Logger {
  constructor(options) {
    return new winston.createLogger({
      levels: config.syslog.levels,
      format: combine(
        timestamp({
          format: options.dateFormat,
        }),
        json()
      ),
      transports: [
        new winston.transports.File(options.file),
        // new winston.transports.Console(options.console),
      ],
      exitOnError: false,
    });
  }
}

module.exports = Logger;
