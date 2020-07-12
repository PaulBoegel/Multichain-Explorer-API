"use strict"

function TransactionController(transRepo) {

  async function getByTxId(req, res) {
    try {
      const chainname = req.params.chainname;
      const txid = req.params.txid;

      const result = await transRepo.getById(txid, chainname);

      return res.json(result);

    } catch(err){
      res.send(err);
    }
  }

  return { getByTxId }
}

module.exports = TransactionController
