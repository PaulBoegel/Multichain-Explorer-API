"use strict";
const BitcoinTransactionFormater = require("./bitcoinTransactionFormater");

function LitecoinTransactionFormater() {
  return Object.setPrototypeOf(
    Object.assign(BitcoinTransactionFormater(), { chainname: "litecoin" }),
    BitcoinTransactionFormater
  );
}

module.exports = LitecoinTransactionFormater;
