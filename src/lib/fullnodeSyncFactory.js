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
  function create(chainId) {
    switch (chainId) {
      case config.litecoin.chainId:
        formater = transactionFormaterManager.getFormater(
          config.litecoin.chainId
        );
        return new LitecoinSync({
          service: fullnodeServiceManager.getService(config.litecoin.chainId),
          transactionHandler,
          formater,
          syncHeight: config.litecoin.syncHeight,
          syncHeightActive: config.litecoin.syncHeightActive,
        });
      case config.bitcoin.chainId:
        formater = transactionFormaterManager.getFormater(
          config.bitcoin.chainId
        );
        return new BitcoinSync({
          service: fullnodeServiceManager.getService(config.bitcoin.chainId),
          transactionHandler,
          formater,
          syncHeight: config.bitcoin.syncHeight,
          syncHeightActive: config.bitcoin.syncHeightActive,
        });
      case config.dash.chainId:
        formater = transactionFormaterManager.getFormater(config.dash.chainId);
        return new DashSync({
          service: fullnodeServiceManager.getService(config.dash.chainId),
          transactionHandler,
          formater,
          syncHeight: config.dash.syncHeight,
          syncHeightActive: config.dash.syncHeightActive,
        });
      case config.ethereum.chainId:
        formater = transactionFormaterManager.getFormater(config.dash.chainId);
        return new EthereumSync({
          service: fullnodeServiceManager.getService(config.dash.chainId),
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
