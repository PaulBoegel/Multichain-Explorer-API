"use strict";

const EventEmitter = require("events");

function EthereumNodeService(rpc, chainname) {
  const events = new EventEmitter();

  async function decodeTransaction(byteArray) {}

  async function getBlockHash({ height }) {}

  async function getBlock({ blockhash, verbose }) {}

  async function getBlockchainInfo() {}

  async function getTransaction({ txid, verbose = false }) {}

  async function handleTransactionInputs(transaction, depth) {}

  return {
    decodeTransaction,
    getTransaction,
    getBlockchainInfo,
    getBlock,
    getBlockHash,
    handleTransactionInputs,
    chainname,
    events,
  };
}

module.exports = EthereumNodeService;
