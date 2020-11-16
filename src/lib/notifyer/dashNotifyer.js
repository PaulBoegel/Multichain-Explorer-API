"use strict";

const EventEmitter = require("events");

function DashNotifyer(conf, sock) {
  const events = new EventEmitter();
  const relationDepth = conf.transactions.notifyerRelationDepth;
  const blockchain = "dash";

  async function connectToSocket() {
    await sock.connect(`tcp://${conf.worker.host}:${conf.worker.port}`);
    console.log(`${blockchain} worker connected to port ${conf.worker.port}`);
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
    sock.subscribe("rawtx");
    for await (const [topic, msg] of sock) {
      events.emit("onNewTransaction", msg, relationDepth, conf.chainname);
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

module.exports = DashNotifyer;
