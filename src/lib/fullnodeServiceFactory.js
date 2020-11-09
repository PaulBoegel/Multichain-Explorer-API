"user-strict";

const LitecoinNodeService = require("./services/litecoinNodeService");
const BitcoinNodeService = require("./services/bitcoinNodeService");
const DashNodeService = require("./services/dashNodeService");
const { RPCClient } = require("rpc-bitcoin");

function FullnodeServiceFactory(config) {
  function create(blockchainName) {
    switch (blockchainName) {
      case config.litecoin.chainname:
        return createLitecoinService();
      case config.bitcoin.chainname:
        return createBitcoinService();
      case config.dash.chainname:
        return createDashService();
    }
  }

  function createLitecoinService() {
    const conf = config.litecoin.rpc;
    const litecoinRpc = new RPCClient({
      url: conf.url,
      user: conf.user,
      pass: conf.pass,
      port: conf.port,
    });
    return new LitecoinNodeService(litecoinRpc, config.litecoin.chainname);
  }

  function createBitcoinService() {
    const conf = config.bitcoin.rpc;
    const bitcoinRpc = new RPCClient({
      url: conf.url,
      user: conf.user,
      pass: conf.pass,
      port: conf.port,
    });
    return new BitcoinNodeService(bitcoinRpc, config.bitcoin.chainname);
  }

  function createDashService() {
    const conf = config.dash.rpc;
    const dashRpc = new RPCClient({
      url: conf.url,
      user: conf.user,
      pass: conf.pass,
      port: conf.port,
    });
    return new DashNodeService(dashRpc, config.dash.chainname);
  }

  return { create };
}

module.exports = FullnodeServiceFactory;
