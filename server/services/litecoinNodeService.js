function LitecoinNodeService(rpc) {

  function decodeTransaction(transaction) {
    return new Promise((resolve, reject) => {
      const transHex = transaction.toString('hex');
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

      if (coinbaseCheck(transaction))
        return null;

      const transactionArray = [];

      for (let index = 0; index < transaction.vin.length; index++) {
        const oldTransaction = await getTransaction(transaction.vin[index].txid)
        transactionArray.push(oldTransaction);
      }

      return transactionArray;

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
