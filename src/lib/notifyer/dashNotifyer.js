"use strict";
const BitcoinNotifyer = require("./bitcoinNotifyer");
function DashNotifyer(conf, sock, chainId) {
  return Object.setPrototypeOf(
    Object.assign(BitcoinNotifyer(conf, sock, chainId), {
      chainId,
    }),
    BitcoinNotifyer
  );
}

module.exports = DashNotifyer;
