"use strict";

function TransactionController(queryBuilderManager) {
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

  async function addressSearch(req, res) {
    try {
      const chainname = req.params.chainname;
      const address = req.params.address;
      const queryBuilder = queryBuilderManager.getQueryBuilder(chainname);
      const transactions = await queryBuilder.addressSearchQuery(address);

      res.setHeader("Conent-Type", "application/json");
      res.send(JSON.stringify(transactions, null, 4));
    } catch (err) {
      res.send(err.message);
    }
    return res.code(404);
  }

  async function getOutput(req, res) {
    try {
      const chainname = req.params.chainname;
      const txid = req.params.txid;
      const transaction = await transactionRepo.getByIds(txid, chainname);

      res.setHeader("Conent-Type", "application/json");
      res.send(JSON.stringify(transaction, null, 4));
    } catch (err) {
      res.send(err.message);
    }
    return res.code(404);
  }

  return { getByTxId, getOutput, addressSearch };
}

module.exports = TransactionController;
