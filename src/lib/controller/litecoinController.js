"use strict";
const BitcoinController = require("./bitcoinController");

function LitecoinController(formater, repo, chainId) {
  return BitcoinController(formater, repo, chainId);
}

module.exports = LitecoinController;
