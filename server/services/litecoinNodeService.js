"use strict";

const EventEmitter = require('events');

function LitecoinNodeService(rpc) {

  const events = new EventEmitter();

  function decodeTransaction(transaction) {
    const transHex = transaction.toString('hex');
    return new Promise((resolve, reject) => {
      rpc.decodeRawTransaction(transHex, (err, resp) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(resp.result);
      });
    });
  }

  function getTransaction(transactionId) {
    return new Promise((resolve, reject) => {
      rpc.getRawTransaction(transactionId, 0, (err, resp) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(resp.result);
      });
    });
  }

  async function handleRelations(transaction) {
    try {

      if (coinbaseCheck(transaction))
        return null;

      for (let index = 0; index < transaction.vin.length; index++) {
        const relation = await getTransaction(transaction.vin[index].txid);
        events.emit('onNewRelation', relation, "litecoin");
      }

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
