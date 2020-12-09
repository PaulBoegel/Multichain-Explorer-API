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
    formatAccountStructure(transaction, transactionPool) {
      const transactionTemplate = new Map();
      const fromAddresses = [];

      for (input of transaction.vin) {
        if (input.coinbase) {
          fromAddresses.push({
            address: [input.coinbase],
            coinbase: true,
            value: 0,
          });
          continue;
        }

        const inputTransaction = transactionPool.find(
          (input) => input.txid === transaction.txid
        );
        if (!inputTransaction) continue;
        let output = inputTransaction.vout.find(
          (entry) => entry.n === input.vout
        );
        if (!output) output = { addresses: [] };
        if (output.addresses) {
          let address = output.addresses;
          fromAddresses.push({
            address,
            value: output.value,
          });
        }
      }

      transaction.from = fromAddresses;

      transactionTemplate.set("vin", false);
      transactionTemplate.set("vout.n", false);
      transactionTemplate.set("vout", "to");

      transaction = this.formater.format({
        obj: transaction,
        templateMap: transactionTemplate,
      });

      transaction.to = transaction.to.map((to) => {
        return { value: to.value, address: to.addresses };
      });

      return transaction;
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
