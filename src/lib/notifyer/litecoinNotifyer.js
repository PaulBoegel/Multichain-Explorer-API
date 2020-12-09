"use strict";
const BitcoinNotifyer = require("./bitcoinNotifyer");
function LitecoinNotifyer(conf, sock, chainId) {
  return Object.setPrototypeOf(
    Object.assign(BitcoinNotifyer(conf, sock, chainId), {
      chainId,
    }),
    BitcoinNotifyer
  );
}

module.exports = LitecoinNotifyer;
