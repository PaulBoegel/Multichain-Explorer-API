"user-strict";

const LitecoinNodeService = require("./services/litecoinNodeService");
const BitcoinNodeService = require("./services/bitcoinNodeService");
const DashNodeService = require("./services/dashNodeService");
const EthereumNodeService = require("./services/ethereumNodeService");
// const { RPCClient } = require("rpc-bitcoin");
const Web3 = require("web3");

function FullnodeServiceFactory(config) {
  function create(blockchainName) {
    switch (blockchainName) {
      case config.litecoin.chainname:
        return createLitecoinService();
      case config.bitcoin.chainname:
        return createBitcoinService();
      case config.dash.chainname:
        return createDashService();
      case config.ethereum.chainname:
        return createEthereumService();
    }
  }

  function createLitecoinService() {
    const conf = config.litecoin.rpc;
    return new LitecoinNodeService(conf, config.litecoin.chainname);
  }

  function createBitcoinService() {
    const conf = config.bitcoin.rpc;
    return new BitcoinNodeService(conf, config.bitcoin.chainname);
  }

  function createDashService() {
    const conf = config.dash.rpc;
    return new DashNodeService(conf, config.dash.chainname);
  }

  function createEthereumService() {
    const conf = config.ethereum.rpc;
    const provider = new Web3.providers.HttpProvider(
      `${conf.url}:${conf.port}`
    );
    const web3 = new Web3(provider);
    return new EthereumNodeService(web3, config.ethereum.chainname);
  }

  return { create };
}

module.exports = FullnodeServiceFactory;
