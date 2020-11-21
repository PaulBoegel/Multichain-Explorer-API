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

  async function getOutput(req, res) {
    try {
      const chainname = req.params.chainname;
      const txid = req.params.txid;
      const query = { chainname, "vin.txid": txid };
      const projection = { _id: 0 };
      const transaction = await transactionRepo.getByIds(txid, chainname);
      const outputs = transaction.vout.map((output) => {
        return { n: output.n, address: output.scriptPubKey.addresses[0] };
      });
      const result = await transactionRepo.get(query, projection);
      if (result) {
        result.forEach((transaction) => {
          const input = transaction.vin.find((input) => (input = txid));
          const { address, n } = outputs.find(
            (output) => output.n === input.vout
          );
          transaction.to = transaction.vout.find(
            (entry) => entry.n === n
          ).scriptPubKey.addresses[0];
          transaction.from = address;
        });
        res.setHeader("Conent-Type", "application/json");
        res.send(JSON.stringify(result, null, 4));
        return;
      }
    } catch (err) {
      res.send(err.message);
    }
    return res.code(404);
  }

  return { getByTxId, getOutput };
}

module.exports = TransactionController;
