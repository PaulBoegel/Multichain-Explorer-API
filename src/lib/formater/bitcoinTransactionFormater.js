const JsonObjectFormatHandler = require("../handler/jsonObjectFormatHandler");

function BitcoinTransactionFormater() {
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
  };

  Object.defineProperty(bitcoinTransactionFormater, "chainname", {
    value: "bitcoin",
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
