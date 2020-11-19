"use strict";
BitcoinNotifyer = require("./bitcoinNotifyer");
function LitecoinNotifyer(conf, sock) {
  return Object.setPrototypeOf(
    Object.assign(BitcoinNotifyer(conf, sock), {}),
    BitcoinNotifyer
  );
}

module.exports = LitecoinNotifyer;
