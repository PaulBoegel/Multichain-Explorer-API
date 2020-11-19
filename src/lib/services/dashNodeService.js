"use strict";
const BitcoinNodeService = require("./bitcoinNodeService");

function DashNodeService(rpc, chainname) {
  return Object.setPrototypeOf(
    Object.assign(BitcoinNodeService(rpc, chainname), {}),
    BitcoinNodeService
  );
}

module.exports = DashNodeService;
