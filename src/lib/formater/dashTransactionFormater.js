"use strict";
const BitcoinTransactionFormater = require("./bitcoinTransactionFormater");

function DashTransactionFormater() {
  const dashTransactionFormater = {
    chainname: "dash",
    formatForDB(transaction) {
      transaction = super.formatForDB(transaction);
      const transactionTemplate = new Map();
      transactionTemplate.set("instantlock", false);
      transactionTemplate.set("instantlock_internal", false);
      return super.formater.format({
        obj: transaction,
        templateMap: transactionTemplate,
      });
    },
  };

  Object.setPrototypeOf(dashTransactionFormater, BitcoinTransactionFormater());

  return dashTransactionFormater;
}

module.exports = DashTransactionFormater;
