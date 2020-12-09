"user-strict";

const zmq = require("zeromq");
const LitecoinNotifyer = require("./notifyer/litecoinNotifyer");
const BitcoinNotifyer = require("./notifyer/bitcoinNotifyer");
const DashNotifyer = require("./notifyer/dashNotifyer");
const EthereumNotifyer = require("./notifyer/ethereumNotifyer");

function FullnodeNotifyerFactory(config) {
  function create(blockchainId) {
    switch (blockchainId) {
      case config.litecoin.chainId:
        return createLitecoinNotifyer();
      case config.bitcoin.chainId:
        return createBitcoinNotifyer();
      case config.dash.chainId:
        return createDashNotifyer();
      case config.ethereum.chainId:
        return createEthereumNotifyer();
    }
  }

  function createLitecoinNotifyer() {
    const litecoinSock = new zmq.Subscriber();
    return new LitecoinNotifyer(
      config.litecoin,
      litecoinSock,
      config.litecoin.chainId
    );
  }

  function createBitcoinNotifyer() {
    const bitcoinSock = new zmq.Subscriber();
    return new BitcoinNotifyer(
      config.bitcoin,
      bitcoinSock,
      config.bitcoin.chainId
    );
  }

  function createDashNotifyer() {
    const dashSock = new zmq.Subscriber();
    return new DashNotifyer(config.dash, dashSock, config.dash.chainId);
  }

  function createEthereumNotifyer() {
    return new EthereumNotifyer(config.ethereum);
  }

  return { create };
}

module.exports = FullnodeNotifyerFactory;
