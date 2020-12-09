"use strict";
const { config } = require("winston");
const BitcoinTransactionFormater = require("./bitcoinTransactionFormater");

function LitecoinTransactionFormater(chainId) {
  return Object.setPrototypeOf(
    Object.assign(BitcoinTransactionFormater(), { chainId }),
    BitcoinTransactionFormater
  );
}

module.exports = LitecoinTransactionFormater;
