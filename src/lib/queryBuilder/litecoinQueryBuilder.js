"use strict";
const BitcoinQueryBuilder = require("./bitcoinQueryBuilder");

function LitecoinQueryBuilder() {
  const litecoinQueryBuilder = {
    chainname: "litecoin",
  };

  Object.setPrototypeOf(litecoinQueryBuilder, BitcoinQueryBuilder());

  return litecoinQueryBuilder;
}

module.exports = LitecoinQueryBuilder;
