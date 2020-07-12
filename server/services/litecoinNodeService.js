"use strict";

const EventEmitter = require('events');

function LitecoinNodeService(rpc) {

  const events = new EventEmitter();

  async function decodeTransaction(byteArray) {
    try {
      const transHex = byteArray.toString('hex');
      const decoded = await rpc.decoderawtransaction({hexstring: transHex});

      if(coinbaseCheck(decoded)){
        decoded.vin = [];

        return decoded;
      }

      return decoded;

    } catch (err) {
      throw err;
    }
  }

  async function getTransaction(transactionId) {
    try {
      return await rpc.getrawtransaction({txid: transactionId, verbose: false})
    } catch (err) {
      throw err;
    }
  }

  async function handleRelations(transaction, depth) {
    try {

      if(depth <= 0)
        return;

      depth--;
      transaction.vin.forEach(async (input) => {
        const relation = await getTransaction(input.txid);
        events.emit('onNewRelation', relation, depth, "litecoin");
      });

    } catch (err) {
      throw err;
    }
  }

  function coinbaseCheck(transaction) {
    if (transaction.vin[0].coinbase == undefined)
      return false;

    return true;
  }

  return { decodeTransaction, getTransaction, handleRelations, events }
}

module.exports = LitecoinNodeService;
