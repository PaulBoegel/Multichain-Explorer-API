const LitecoinSync = require("./sync/litecoinSync");
const BitcoinSync = require("./sync/bitcoinSync");
const DashSync = require("./sync/dashSync");
const EthereumSync = require("./sync/ethereumSync");

function FullnodeSyncFactory({
  fullnodeServiceManager,
  transactionHandler,
  config,
}) {
  function create(chainname) {
    switch (chainname) {
      case "litecoin":
        return new LitecoinSync({
          service: fullnodeServiceManager.getService(chainname),
          transactionHandler,
          syncHeight: config.litecoin.syncHeight,
          syncHeightActive: config.litecoin.syncHeightActive,
        });
      case "bitcoin":
        return new BitcoinSync({
          service: fullnodeServiceManager.getService(chainname),
          transactionHandler,
          syncHeight: config.bitcoin.syncHeight,
          syncHeightActive: config.bitcoin.syncHeightActive,
        });
      case "dash":
        return new DashSync({
          service: fullnodeServiceManager.getService(chainname),
          transactionHandler,
          syncHeight: config.dash.syncHeight,
          syncHeightActive: config.dash.syncHeightActive,
        });
      case "ethereum":
        return new EthereumSync({
          service: fullnodeServiceManager.getService(chainname),
          transactionHandler,
          syncHeight: config.ethereum.syncHeight,
          syncHeightActive: config.ethereum.syncHeightActive,
        });
    }
  }

  return { create };
}

module.exports = FullnodeSyncFactory;
