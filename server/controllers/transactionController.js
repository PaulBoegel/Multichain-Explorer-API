"use strict"

function TransactionController(transactionHandler, fullnodeApiManager) {

  async function getByTxId(req, res) {
    try {
      const chainname = req.params.chainname;
      const txid = req.params.txid;
      const service = fullnodeApiManager.getService(chainname);

      let result = await transactionHandler.getTransaction(txid, service)

      if(result){
        res.json(result);
        return;
      }

      return res.code(404);

    } catch(err){
      res.send(err.message);
    }
  }

  return { getByTxId }
}

module.exports = TransactionController
