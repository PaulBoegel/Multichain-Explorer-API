"use strict";
const BitcoinQueryBuilder = require("./bitcoinQueryBuilder");

function DashQueryBuilder(formater, repo) {
  const dashQueryBuilder = {
    repo,
    formater,
    chainname: "dash",
  };

  Object.setPrototypeOf(dashQueryBuilder, BitcoinQueryBuilder());

  return dashQueryBuilder;
}

module.exports = DashQueryBuilder;
