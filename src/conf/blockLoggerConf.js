appRoot = require("app-root-path");

const options = {
  file: {
    level: "info",
    filename: `${appRoot}/log/block.log`,
    timestamp: true,
    handleExceptions: false,
    json: true,
    maxsize: 5242880, // 5MB
    // maxFiles: 5,
    colorize: false,
  },
  console: {
    level: "debug",
    handleExceptions: true,
    json: true,
    colorize: true,
  },
  dateFormat: "YYYY-MM-DD HH:mm:ss",
};

module.exports = options;
