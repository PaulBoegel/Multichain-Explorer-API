"use strict";
const BitcoinNodeService = require("./bitcoinNodeService");

function LitecoinNodeService(rpc, chainname) {
  return Object.setPrototypeOf(
    Object.assign(BitcoinNodeService(rpc, chainname), {}),
    BitcoinNodeService
  );
}

module.exports = LitecoinNodeService;
