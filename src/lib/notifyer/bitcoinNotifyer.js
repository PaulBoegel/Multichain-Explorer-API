"use strict";
const EventEmitter = require("events");
function BitcoinNotifyer(conf, sock, chainId) {
  const relationDepth = conf.transactions.notifyerRelationDepth;
  return {
    events: new EventEmitter(),
    chainId,
    async connectToSocket() {
      await sock.connect(`tcp://${conf.worker.host}:${conf.worker.port}`);
      console.log(
        `${this.blockchain} worker connected to port ${conf.worker.port}`
      );
    },
    async closeConnection() {
      return await sock.close();
    },
    async subscribeToBlocks() {
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
