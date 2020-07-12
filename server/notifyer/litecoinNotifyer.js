"use strict";

const EventEmitter = require('events');

function LitecoinNotifyer(conf, sock) {

  const events = new EventEmitter();
  const relationDepth = conf.transactions.notifyerRelationDepth;

  async function connectToSocket() {
    try {
      await sock.connect(`tcp://${conf.worker.host}:${conf.worker.port}`);
      console.log(`Litecoin worker connected to port ${conf.worker.port}`);
    } catch (e) {
      throw e;
    }
  }

  async function subscribeToTransactions() {
    try {
      sock.subscribe("rawtx")
      for await (const [topic, msg] of sock) {
        events.emit('onNewTransaction', msg, relationDepth, "litecoin");
      }
    } catch (e) {
      throw e;
    }
  }

  return { connectToSocket, subscribeToTransactions, events }
}

module.exports = LitecoinNotifyer;
