"use strict";

function EthereumNodeService(web3, chainname) {
  async function decodeTransaction(byteArray) {}

  async function getBlockHash({ height }) {
    const { hash } = await web3.eth.getBlock(height);
    return hash;
  }

  async function getBlock({ blockhash, verbose }) {
    const { transactions, ...blockData } = await web3.eth.getBlock(
      blockhash,
      verbose
    );
    const block = Object.assign({}, blockData);
    block.tx = transactions.map((transaction) => {
      if (typeof transaction === "string") return transaction;
      const { hash, ...transactionData } = transaction;
      const updatedTransaction = Object.assign({ txid: hash }, transactionData);
      return updatedTransaction;
    });
    return block;
  }

  async function getBlockchainInfo() {
    const { currentBlock } = await web3.eth.isSyncing();
    return {
      blocks: currentBlock,
    };
  }

  async function getTransaction({ txid }) {
    const { hash, ...transactionData } = await web3.eth.getTransaction(txid);
    const transaction = Object.assign({ txid: hash }, transactionData);
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
