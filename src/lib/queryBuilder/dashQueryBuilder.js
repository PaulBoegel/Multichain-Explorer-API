"use strict";
const BitcoinQueryBuilder = require("./bitcoinQueryBuilder");

function DashQueryBuilder(formater, repo, chainId) {
  const dashQueryBuilder = {
    repo,
    formater,
    chainId,
  };

  Object.setPrototypeOf(dashQueryBuilder, BitcoinQueryBuilder());

  return dashQueryBuilder;
}

module.exports = DashQueryBuilder;
