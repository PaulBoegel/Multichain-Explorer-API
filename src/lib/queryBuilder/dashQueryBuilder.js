"use strict";
const BitcoinQueryBuilder = require("./bitcoinQueryBuilder");

function DashQueryBuilder() {
  const dashQueryBuilder = {
    chainname: "dash",
  };

  Object.setPrototypeOf(dashQueryBuilder, BitcoinQueryBuilder());

  return dashQueryBuilder;
}

module.exports = DashQueryBuilder;
