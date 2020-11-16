const Logger = require("./logger");

class ErrorLogger {
  static #INSTANTS = null;
  constructor(options) {
    if (typeof ErrorLogger.#INSTANTS === "object") return;
    ErrorLogger.#INSTANTS = new Logger(options);
  }

  static error(message) {
    if (typeof ErrorLogger.#INSTANTS === "object")
      return ErrorLogger.#INSTANTS.error(message);

    throw new Error("logger not instantiated");
  }
}

module.exports = ErrorLogger;
