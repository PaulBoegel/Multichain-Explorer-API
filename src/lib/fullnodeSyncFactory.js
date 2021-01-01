const LitecoinSync = require("./sync/litecoinSync");
const BitcoinSync = require("./sync/bitcoinSync");
const DashSync = require("./sync/dashSync");
const EthereumSync = require("./sync/ethereumSync");

function FullnodeSyncFactory({
  fullnodeServiceManager,
  transactionFormaterManager,
  dataHandler,
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
          dataHandler,
          formater,
          endHeight: config.litecoin.endHeight,
          runSync: config.litecoin.runSync,
        });
      case config.bitcoin.chainId:
        formater = transactionFormaterManager.getFormater(
          config.bitcoin.chainId
        );
        return new BitcoinSync({
          service: fullnodeServiceManager.getService(config.bitcoin.chainId),
          dataHandler,
          formater,
          endHeight: config.bitcoin.endHeight,
          runSync: config.bitcoin.runSync,
        });
      case config.dash.chainId:
        formater = transactionFormaterManager.getFormater(config.dash.chainId);
        return new DashSync({
          service: fullnodeServiceManager.getService(config.dash.chainId),
          dataHandler,
          formater,
          endHeight: config.dash.endHeight,
          runSync: config.dash.runSync,
        });
      case config.ethereum.chainId:
        formater = transactionFormaterManager.getFormater(
          config.ethereum.chainId
        );
        return new EthereumSync({
          service: fullnodeServiceManager.getService(config.ethereum.chainId),
          dataHandler,
          formater,
          endHeight: config.ethereum.endHeight,
          runSync: config.ethereum.runSync,
        });
    }
  }

  return { create };
}

module.exports = FullnodeSyncFactory;
