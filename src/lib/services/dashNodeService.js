"use strict";
const BitcoinNodeService = require("./bitcoinNodeService");

function DashNodeService(rpc, chainId) {
  return Object.setPrototypeOf(
    Object.assign(BitcoinNodeService(rpc, chainId), {}),
    BitcoinNodeService
  );
}

module.exports = DashNodeService;
