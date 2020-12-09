"use strict";
const BitcoinNodeService = require("./bitcoinNodeService");

function LitecoinNodeService(rpc, chainId) {
  return Object.setPrototypeOf(
    Object.assign(BitcoinNodeService(rpc, chainId), {}),
    BitcoinNodeService
  );
}

module.exports = LitecoinNodeService;
