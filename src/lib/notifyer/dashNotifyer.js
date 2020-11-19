"use strict";
const BitcoinNotifyer = require("./bitcoinNotifyer");
function DashNotifyer(conf, sock) {
  return Object.setPrototypeOf(
    Object.assign(BitcoinNotifyer(conf, sock), {
      blockchain: "dash",
    }),
    BitcoinNotifyer
  );
}

module.exports = DashNotifyer;
