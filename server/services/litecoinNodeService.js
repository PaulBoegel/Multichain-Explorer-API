"use strict";

function LitecoinNodeService(rpc) {

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

  async function getTransaction(transactionId) {
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

  async function getRelations(transaction) {
    try {
      const transactionArray = [];

      if (coinbaseCheck(transaction))
        return null;

      for (let index = 0; index < transaction.vin.length; index++) {
        transactionArray.push(getTransaction(transaction.vin[index].txid));
      }

      return Promise.all(transactionArray);

    } catch (err) {
      throw err;
    }
  }

  function coinbaseCheck(transaction) {
    if (transaction.vin[0].coinbase == undefined)
      return false;

    return true;
  }

  return { decodeTransaction, getTransaction, getRelations }
}

module.exports = LitecoinNodeService;
