const { assert } = require("chai");
const sinon = require("sinon");
const options = require("./options.js");
const fs = require("fs");
const LogHandler = require("../../src/lib/logger/logger.js");

describe("LogHandler info", () => {
  it("should log info call in file", () => {
    const logger = new LogHandler(options);
    LogHandler.info({ name: "info test", message: { type: "info" } });
    const log = fs.readFileSync(options.file.filename);
    console.log(JSON.parse(log));
    assert.strictEqual(JSON.parse(log).type, "info");
  });
});

describe("LogHandler error", () => {
  it("should log error call in file", () => {
    const logger = new LogHandler(options);
    LogHandler.error({ type: "error" });
    const log = fs.readFileSync(options.file.filename);
    assert.strictEqual(JSON.parse(log).type, "error");
  });
});

describe("LogHandler exceptions", () => {
  it("should log exceptions", () => {
    const logger = new LogHandler(options);
    throw new Error("Exception Test");
  });
});
