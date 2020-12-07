const LitecoinSync = require("./sync/litecoinSync");
const BitcoinSync = require("./sync/bitcoinSync");
const DashSync = require("./sync/dashSync");
const EthereumSync = require("./sync/ethereumSync");

function FullnodeSyncFactory({
  fullnodeServiceManager,
  transactionFormaterManager,
  transactionHandler,
  config,
}) {
  function create(chainname) {
    switch (chainname) {
      case "litecoin":
        formater = transactionFormaterManager.getFormater("litecoin");
        return new LitecoinSync({
          service: fullnodeServiceManager.getService(chainname),
          transactionHandler,
          formater,
          syncHeight: config.litecoin.syncHeight,
          syncHeightActive: config.litecoin.syncHeightActive,
        });
      case "bitcoin":
        formater = transactionFormaterManager.getFormater("bitcoin");
        return new BitcoinSync({
          service: fullnodeServiceManager.getService(chainname),
          transactionHandler,
          formater,
          syncHeight: config.bitcoin.syncHeight,
          syncHeightActive: config.bitcoin.syncHeightActive,
        });
      case "dash":
        formater = transactionFormaterManager.getFormater("dash");
        return new DashSync({
          service: fullnodeServiceManager.getService(chainname),
          transactionHandler,
          formater,
          syncHeight: config.dash.syncHeight,
          syncHeightActive: config.dash.syncHeightActive,
        });
      case "ethereum":
        formater = transactionFormaterManager.getFormater("ethereum");
        return new EthereumSync({
          service: fullnodeServiceManager.getService(chainname),
          transactionHandler,
          formater,
          syncHeight: config.ethereum.syncHeight,
          syncHeightActive: config.ethereum.syncHeightActive,
        });
    }
  }

  return { create };
}

module.exports = FullnodeSyncFactory;
