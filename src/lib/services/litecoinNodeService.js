"use strict";

const EventEmitter = require("events");

function LitecoinNodeService(rpc, chainname) {
  async function decodeTransaction(byteArray) {
    try {
      const transHex = byteArray.toString("hex");
      const decoded = await rpc.decoderawtransaction({ hexstring: transHex });

      if (coinbaseCheck(decoded)) {
        decoded.vin = [];

        return decoded;
      }

      return decoded;
    } catch (err) {
      throw err;
    }
  }

  async function getBlockHash({ height }) {
    return await rpc.getblockhash({ height });
  }

  async function getBlock({ blockhash, verbose }) {
    const { height, hash, tx, nextblockhash } = await rpc.getblock({
      blockhash,
      verbosity: verbose ? 2 : 1,
    });
    return { height, hash, tx, nextblockhash };
  }

  async function getBlockchainInfo() {
    return await rpc.getblockchaininfo();
  }

  async function getTransaction({ txid, verbose = false }) {
    return await rpc.getrawtransaction({ txid, verbose });
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

module.exports = LitecoinNodeService;
