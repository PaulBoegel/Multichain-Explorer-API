"use strict";
const BitcoinQueryBuilder = require("./bitcoinQueryBuilder");

function LitecoinQueryBuilder(formater, repo, chainId) {
  const litecoinQueryBuilder = {
    repo,
    formater,
    chainId,
  };

  Object.setPrototypeOf(litecoinQueryBuilder, BitcoinQueryBuilder());

  return litecoinQueryBuilder;
}

module.exports = LitecoinQueryBuilder;
