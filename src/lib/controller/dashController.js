"use strict";
const BitcoinController = require("./bitcoinController");

function DashController(formater, repo, chainId) {
  const dashController = {
    repo,
    formater,
    chainId,
  };

  Object.setPrototypeOf(dashController, BitcoinController());

  return dashController;
}

module.exports = DashController;
