appRoot = require("app-root-path");

const options = {
  file: {
    level: "info",
    filename: `${appRoot}/test/log-tests/log/test.log`,
    timestamp: true,
    handleExceptions: true,
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
};

module.exports = options;
