"use strict";
const BitcoinController = require("./bitcoinController");

function LitecoinController(formater, repo, chainId) {
  const litecoinController = {
    repo,
    formater,
    chainId,
  };

  Object.setPrototypeOf(BitcoinController, BitcoinController());

  return litecoinController;
}

module.exports = LitecoinController;
