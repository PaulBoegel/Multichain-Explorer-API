const JsonObjectFormatHandler = require("../handler/jsonObjectFormatHandler");

function BitcoinTransactionFormater(chainId) {
  function _formatDbVout(vout) {
    const outputTemplate = new Map();
    outputTemplate.set("scriptPubKey.addresses", "addresses");
    outputTemplate.set("scriptPubKey", false);
    vout.forEach((output) => {
      output = this.formater.format({
        obj: output,
        templateMap: outputTemplate,
      });
    });
    return vout;
  }

  function _formatDbVin(vin) {
    const inputTemplate = new Map();
    inputTemplate.set("scriptSig", false);
    inputTemplate.set("txinwitness", false);
    inputTemplate.set("sequence", false);
    vin.forEach((input) => {
      input = this.formater.format({
        obj: input,
        templateMap: inputTemplate,
      });
    });
    return vin;
  }

  const bitcoinTransactionFormater = {
    formatForDB(transaction) {
      const transactionTemplate = new Map();
      let formatedTransaction;

      transactionTemplate.set("version", false);
      transactionTemplate.set("size", false);
      transactionTemplate.set("vsize", false);
      transactionTemplate.set("weight", false);
      transactionTemplate.set("hex", false);
      transactionTemplate.set("confirmations", false);
      transactionTemplate.set("blocktime", false);
      transactionTemplate.set("time", false);
      transactionTemplate.set("locktime", false);
      transactionTemplate.set("hash", false);

      formatedTransaction = this.formater.format({
        obj: transaction,
        templateMap: transactionTemplate,
      });

      formatedTransaction.vout = _formatDbVout.call(
        this,
        formatedTransaction.vout
      );

      formatedTransaction.vin = _formatDbVin.call(
        this,
        formatedTransaction.vin
      );

      return formatedTransaction;
    },
    formatAccountStructure({ transactions, txRelationPool = [], out = false }) {
      if (out) {
        txRelationPool.push(...transactions);
      }

      transactions.forEach((transaction) => {
        transaction.from = [];
        transaction.to = [];

        transaction.to = transaction.vout.map((out) => {
          return {
            value: parseFloat(out.value.toFixed(8)),
            address: out.scriptPubKey.addresses,
          };
        });
        transaction.vin.forEach((input) => {
          if (input.coinbase) {
            transaction.from.push({
              address: [input.coinbase],
              coinbase: true,
              value: 0,
            });
            return;
          }

          const inputTransaction = txRelationPool.find(
            (relation) => relation.txid === input.txid
          );
          if (!inputTransaction) return;
          let output = inputTransaction.vout.find(
            (entry) => entry.n === input.vout
          );
          if (!output) {
            output = { address: [], value: 0 };
            return;
          }
          if (output.scriptPubKey.addresses) {
            let address = output.scriptPubKey.addresses;
            transaction.from.push({
              address,
              value: parseFloat(output.value.toFixed(8)),
            });
          }
        });
      });

      return transactions;
    },
  };

  Object.defineProperty(bitcoinTransactionFormater, "chainId", {
    value: chainId,
    writable: true,
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(bitcoinTransactionFormater, "formater", {
    value: JsonObjectFormatHandler(),
    writable: false,
    enumerable: true,
    configurable: true,
  });

  return bitcoinTransactionFormater;
}

module.exports = BitcoinTransactionFormater;
