const LitecoinSync = require("./sync/litecoinSync");
const BitcoinSync = require("./sync/bitcoinSync");
const DashSync = require("./sync/dashSync");

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
          syncHeightActive: config.litecoin.syncHeightActive,
        });
      case "dash":
        return new DashSync({
          service: fullnodeServiceManager.getService(chainname),
          transactionHandler,
          syncHeight: config.dash.syncHeight,
          syncHeightActive: config.litecoin.syncHeightActive,
        });
    }
  }

  return { create };
}

module.exports = FullnodeSyncFactory;
