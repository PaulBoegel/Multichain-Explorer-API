"use strict";

function TransactionController(
  transactionRepo,
  formaterManager,
  queryBuilderManager
) {
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

  async function getAddress(req, res) {
    try {
      const chainname = req.params.chainname;
      const address = req.params.address;
      const queryBuilder = queryBuilderManager.getQueryBuilder(chainname);
      const query = queryBuilder.addressSearchQuery(address);
      const transactions = await transactionRepo.get(query);
      const result = [];
      for (let transaction of transactions) {
        const transaction = await formater.formatAccountStructure(
          transaction,
          transactionRepo
        );
        result.push(transaction);
      }
      res.setHeader("Conent-Type", "application/json");
      res.send(JSON.stringify(result, null, 4));
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
      const formater = formaterManager.getFormater(chainname);
      const formatedTransaction = await formater.formatAccountStructure(
        transaction,
        transactionRepo
      );
      res.setHeader("Conent-Type", "application/json");
      res.send(JSON.stringify(formatedTransaction, null, 4));
    } catch (err) {
      res.send(err.message);
    }
    return res.code(404);
  }

  return { getByTxId, getOutput };
}

module.exports = TransactionController;
