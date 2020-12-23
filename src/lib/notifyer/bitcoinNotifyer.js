"use strict";
const EventEmitter = require("events");
const BlockLogger = require("../logger/blockLogger");
function BitcoinNotifyer(conf, sock, chainId) {
  const relationDepth = conf.transactions.notifyerRelationDepth;

  function _logNotifyerStarted() {
    BlockLogger.info({
      message: "Notifyer started",
      data: { chainId: `${this.chainId}` },
    });
  }

  return {
    events: new EventEmitter(),
    chainId,
    async connectToSocket() {
      await sock.connect(`tcp://${conf.worker.host}:${conf.worker.port}`);
    },
    async closeConnection() {
      return await sock.close();
    },
    async subscribeToBlocks() {
      _logNotifyerStarted.call(this);
      sock.subscribe("hashblock");
      for await (const [topic, msg] of sock) {
        this.events.emit("onNewBlock", msg.toString("hex"), conf.chainId);
      }
    },
    async subscribeToTransactions() {
      sock.subscribe("rawtx");
      for await (const [topic, msg] of sock) {
        this.events.emit("onNewTransaction", msg, relationDepth, conf.chainId);
      }
    },
  };
}

module.exports = BitcoinNotifyer;
