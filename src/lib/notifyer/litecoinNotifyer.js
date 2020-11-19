"use strict";
const BitcoinNotifyer = require("./bitcoinNotifyer");
function LitecoinNotifyer(conf, sock) {
  return Object.setPrototypeOf(
    Object.assign(BitcoinNotifyer(conf, sock), {
      blockchain: "litecoin",
    }),
    BitcoinNotifyer
  );
}

module.exports = LitecoinNotifyer;
