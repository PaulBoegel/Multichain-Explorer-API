"user-strict";

const zmq = require("zeromq");
const LitecoinNotifyer = require("./notifyer/litecoinNotifyer");
const BitcoinNotifyer = require("./notifyer/bitcoinNotifyer");
const DashNotifyer = require("./notifyer/dashNotifyer");
const EthereumNotifyer = require("./notifyer/ethereumNotifyer");

function FullnodeNotifyerFactory(config) {
  function create(blockchainName) {
    switch (blockchainName) {
      case config.litecoin.chainname:
        return createLitecoinNotifyer();
      case config.bitcoin.chainname:
        return createBitcoinNotifyer();
      case config.dash.chainname:
        return createDashNotifyer();
      case config.ethereum.chainname:
        return createEthereumNotifyer();
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

  function createDashNotifyer() {
    const dashSock = new zmq.Subscriber();
    return new DashNotifyer(config.dash, dashSock);
  }

  function createEthereumNotifyer() {
    return new EthereumNotifyer(config.ethereum);
  }

  return { create };
}

module.exports = FullnodeNotifyerFactory;
