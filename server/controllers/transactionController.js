"use strict"

function TransactionController(transRepo, fullnodeApiManager) {

  async function getByTxId(req, res) {
    try {
      const chainname = req.params.chainname;
      const txid = req.params.txid;

      let result = await transRepo.getById(txid, chainname);

      if(result)
        return res.json(result);

      result = await fullnodeApiManager.getTransactionFromNode(chainname, txid);

      if(result){
        await transRepo.add(result);
        return res.json(result);
      }

      return res.code(404);

    } catch(err){
      res.send(err.message);
    }
  }

  return { getByTxId }
}

module.exports = TransactionController
