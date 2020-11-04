"user-strict";

const zmq = require("zeromq");
const LitecoinNotifyer = require("./notifyer/litecoinNotifyer");
const BitcoinNotifyer = require("./notifyer/bitcoinNotifyer");

function FullnodeNotifyerFactory(config) {
  function create(blockchainName) {
    switch (blockchainName) {
      case config.litecoin.chainname:
        return createLitecoinNotifyer();
        break;
      case config.bitcoin.chainname:
        return createBitcoinNotifyer();
    }
  }

  function createLitecoinNotifyer() {
    const litecoinSock = new zmq.Subscriber();
    return new LitecoinNotifyer(config.litecoin, litecoinSock);
  }

  function createBitcoinNotifyer() {
    const bitcoinSock = new zmq.Subscriber();
    return new BitcoinNotifyer(config.bitcoin, bitcoinSock);
  }

  return { create };
}

module.exports = FullnodeNotifyerFactory;
