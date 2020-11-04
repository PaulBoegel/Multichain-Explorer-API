"use strict";

const EventEmitter = require("events");

function LitecoinNodeService(rpc, chainname) {
  const events = new EventEmitter();

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
    return await rpc.getblock({
      blockhash,
      verbosity: verbose ? 2 : 1,
    });
  }

  async function getTransaction({ txid, verbose = false }) {
    return await rpc.getrawtransaction({ txid, verbose });
  }

  async function handleTransactionInputs(transaction, depth) {
    try {
      const inputs = [];
      const vin = transaction.vin;

      if (vin.length == 0) return;

      if (depth == 0) return;

      depth--;

      for (let i = 0; i < vin.length; i++) {
        inputs.push(await getTransaction(vin[i].txid, true));
      }

      events.emit("onNewInputs", inputs, depth, chainname);
    } catch (err) {
      throw err;
    }
  }

  function coinbaseCheck(transaction) {
    if (transaction.vin[0].coinbase == undefined) return false;

    return true;
  }

  return {
    decodeTransaction,
    getTransaction,
    getBlock,
    getBlockHash,
    handleTransactionInputs,
    chainname,
    events,
  };
}

module.exports = LitecoinNodeService;
