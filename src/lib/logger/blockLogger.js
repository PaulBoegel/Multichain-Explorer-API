const Logger = require("./logger");

class BlockLogger {
  static INSTANTS;
  constructor(options) {
    if (typeof BlockLogger.INSTANTS === "object") return;
    BlockLogger.INSTANTS = new Logger(options);
  }

  static info({ message, data }) {
    if (typeof BlockLogger.INSTANTS === "object")
      return BlockLogger.INSTANTS.info(message, data);

    throw new Error("logger not instantiated");
  }
}

module.exports = BlockLogger;
