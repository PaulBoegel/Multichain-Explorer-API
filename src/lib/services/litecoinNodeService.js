"use strict";

const EventEmitter = require('events');

function LitecoinNodeService(rpc, chainname) {

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

  async function getTransaction(transactionId, verbose = false) {
    try {
      return await rpc.getrawtransaction({txid: transactionId, verbose: verbose})
    } catch (err) {
      throw err;
    }
  }

  async function handleTransactionInputs(transaction, depth) {
    try {
      const inputs = [];
      const vin = transaction.vin;

      if(vin.length == 0)
        return;

      if(depth == 0)
        return;

      depth--;

      for(let i=0; i<vin.length; i++){
        inputs.push(await getTransaction(vin[i].txid, true));
      }

      events.emit('onNewInputs', inputs, depth, chainname);

    } catch (err) {
      throw err;
    }
  }

  function coinbaseCheck(transaction) {
    if (transaction.vin[0].coinbase == undefined)
      return false;

    return true;
  }

  return { decodeTransaction, getTransaction, handleTransactionInputs, chainname, events }
}

module.exports = LitecoinNodeService;
