"use strict";
const BitcoinQueryBuilder = require("./bitcoinQueryBuilder");

function LitecoinQueryBuilder(formater, repo) {
  const litecoinQueryBuilder = {
    repo,
    formater,
    chainname: "litecoin",
  };

  Object.setPrototypeOf(litecoinQueryBuilder, BitcoinQueryBuilder());

  return litecoinQueryBuilder;
}

module.exports = LitecoinQueryBuilder;
