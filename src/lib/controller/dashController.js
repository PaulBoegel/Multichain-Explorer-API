"use strict";
const BitcoinController = require("./bitcoinController");

function DashController(formater, repo, chainId) {
  return BitcoinController(formater, repo, chainId);
}

module.exports = DashController;
