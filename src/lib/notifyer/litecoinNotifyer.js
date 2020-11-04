"use strict";

const EventEmitter = require("events");

function LitecoinNotifyer(conf, sock) {
  const events = new EventEmitter();
  const relationDepth = conf.transactions.notifyerRelationDepth;
  const blockchain = "litecoin";

  async function connectToSocket() {
    try {
      await sock.connect(`tcp://${conf.worker.host}:${conf.worker.port}`);
      console.log(`Litecoin worker connected to port ${conf.worker.port}`);
    } catch (e) {
      throw e;
    }
  }

  async function closeConnection() {
    return await sock.close();
  }

  async function subscribeToBlocks() {
    sock.subscribe("hashblock");
    for await (const [topic, msg] of sock) {
      events.emit("onNewBlock", msg.toString("hex"), conf.chainname);
    }
  }

  async function subscribeToTransactions() {
    try {
      sock.subscribe("rawtx");
      for await (const [topic, msg] of sock) {
        events.emit("onNewTransaction", msg, relationDepth, conf.chainname);
      }
    } catch (e) {
      throw e;
    }
  }

  return {
    connectToSocket,
    closeConnection,
    subscribeToTransactions,
    subscribeToBlocks,
    blockchain,
    events,
  };
}

module.exports = LitecoinNotifyer;
