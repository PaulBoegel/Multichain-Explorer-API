"use strict";
BitcoinNotifyer = require("./bitcoinNotifyer");
function DashNotifyer(conf, sock) {
  return Object.setPrototypeOf(
    Object.assign(BitcoinNotifyer(conf, sock), {}),
    BitcoinNotifyer
  );
}

module.exports = DashNotifyer;
