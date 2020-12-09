"use strict";

function TransactionController(queryBuilderManager) {
  async function getByTxId(req, res) {
    try {
      const chainId = req.params.chainId;
      const txid = req.params.txid;

      let result = await transactionRepo.getByIds(txid, chainId);

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
      const chainId = req.param("chainId");
      const from = req.param("from") === "" ? undefined : req.param("from");
      const to = req.param("to") === "" ? undefined : req.param("to");
      const limit = parseInt(req.param("limit"));

      const queryBuilder = queryBuilderManager.getQueryBuilder(chainId);
      const transactions = await queryBuilder.addressSearchQuery(
        from,
        to,
        limit
      );

      res.setHeader("Conent-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      res.send(JSON.stringify(transactions, null, 4));
    } catch (err) {
      res.send(err.message);
    }
    // return res.code(404);
  }

  async function getOutput(req, res) {
    try {
      const chainId = req.params.chainId;
      const txid = req.params.txid;
      const transaction = await transactionRepo.getByIds(txid, chainId);

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
