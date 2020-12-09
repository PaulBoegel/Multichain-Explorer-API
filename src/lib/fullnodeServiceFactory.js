"user-strict";

const LitecoinNodeService = require("./services/litecoinNodeService");
const BitcoinNodeService = require("./services/bitcoinNodeService");
const DashNodeService = require("./services/dashNodeService");
const EthereumNodeService = require("./services/ethereumNodeService");
// const { RPCClient } = require("rpc-bitcoin");
const Web3 = require("web3");

function FullnodeServiceFactory(config) {
  function create(blockchainId) {
    switch (blockchainId) {
      case config.litecoin.chainId:
        return createLitecoinService();
      case config.bitcoin.chainId:
        return createBitcoinService();
      case config.dash.chainId:
        return createDashService();
      case config.ethereum.chainId:
        return createEthereumService();
    }
  }

  function createLitecoinService() {
    const conf = config.litecoin.rpc;
    return new LitecoinNodeService(conf, config.litecoin.chainId);
  }

  function createBitcoinService() {
    const conf = config.bitcoin.rpc;
    return new BitcoinNodeService(conf, config.bitcoin.chainId);
  }

  function createDashService() {
    const conf = config.dash.rpc;
    return new DashNodeService(conf, config.dash.chainId);
  }

  function createEthereumService() {
    const conf = config.ethereum.rpc;
    const provider = new Web3.providers.HttpProvider(
      `${conf.url}:${conf.port}`
    );
    const web3 = new Web3(provider);
    return new EthereumNodeService(web3, config.ethereum.chainId);
  }

  return { create };
}

module.exports = FullnodeServiceFactory;
