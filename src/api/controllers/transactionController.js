"use strict";

function TransactionController(transactionRepo) {
  async function getByTxId(req, res) {
    try {
      const chainname = req.params.chainname;
      const txid = req.params.txid;

      let result = await transactionRepo.getByIds(txid, chainname);

      if (result) {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(result, null, 4));
        return;
      }

      return res.code(404);
    } catch (err) {
      res.send(err.message);
    }
  }

  return { getByTxId };
}

module.exports = TransactionController;
