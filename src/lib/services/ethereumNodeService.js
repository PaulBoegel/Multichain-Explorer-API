"use strict";

const EventEmitter = require("events");

function EthereumNodeService(web3, chainname) {
  async function decodeTransaction(byteArray) {}

  async function getBlockHash({ height }) {
    const { hash } = await web3.eth.getBlock(height);
    return hash;
  }

  async function getBlock({ blockhash, verbose }) {
    const block = await web3.eth.getBlock(blockhash, verbose);
    return block;
  }

  async function getBlockchainInfo() {
    const { currentBlock } = await web3.eth.isSyncing();
    return {
      blocks: currentBlock,
    };
  }

  async function getTransaction({ txid }) {
    const transaction = await web3.eth.getTransaction(txid);
    return transaction;
  }

  return {
    decodeTransaction,
    getTransaction,
    getBlockchainInfo,
    getBlock,
    getBlockHash,
    chainname,
  };
}

module.exports = EthereumNodeService;
