const { config } = require("winston");
const JsonObjectFormatHandler = require("../handler/jsonObjectFormatHandler");

function EthereumTransactionFormater(chainId) {
  const ethereumTransactionFormater = {
    formatForDB(transaction) {
      const transactionTemplate = new Map();

      transactionTemplate.set("blockHash", false);
      transactionTemplate.set("gasPrice", false);
      transactionTemplate.set("nonce", false);
      transactionTemplate.set("transactionIndex", false);
      transactionTemplate.set("v", false);
      transactionTemplate.set("r", false);
      transactionTemplate.set("s", false);

      transaction = this.formater.format({
        obj: transaction,
        templateMap: transactionTemplate,
      });

      return transaction;
    },
    formatAccountStructure({ transaction }) {
      const to = transaction.to;
      const from = transaction.from;

      transaction.to = [
        {
          value: transaction.value,
          address: [to],
        },
      ];
      transaction.from = [
        {
          value: transaction.value,
          address: [from],
        },
      ];

      return transaction;
    },
  };

  Object.defineProperty(ethereumTransactionFormater, "chainId", {
    value: chainId,
    writable: false,
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(ethereumTransactionFormater, "formater", {
    value: JsonObjectFormatHandler(),
    writable: false,
    enumerable: true,
    configurable: true,
  });

  return ethereumTransactionFormater;
}

module.exports = EthereumTransactionFormater;
