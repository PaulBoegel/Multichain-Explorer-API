const BitcoinController = require("./controller/bitcoinController");
const LitecoinController = require("./controller/litecoinController");
const DashController = require("./controller/dashController");
const EthereumController = require("./controller/ethereumController");

function ControllerFactory(formaterManager, blockRepo, conf) {
  return {
    create(chainId) {
      switch (chainId) {
        case conf.bitcoin.chainId:
          return BitcoinController(
            formaterManager.getFormater(conf.bitcoin.chainId),
            blockRepo,
            conf.bitcoin.chainId
          );
        case conf.litecoin.chainId:
          return LitecoinController(
            formaterManager.getFormater(conf.litecoin.chainId),
            blockRepo,
            conf.litecoin.chainId
          );
        case conf.dash.chainId:
          return DashController(
            formaterManager.getFormater(conf.litecoin.chainId),
            blockRepo,
            conf.dash.chainId
          );
        case conf.ethereum.chainId:
          return EthereumController(
            formaterManager.getFormater(conf.ethereum.chainId),
            blockRepo,
            conf.ethereum.chainId
          );
      }
    },
  };
}

module.exports = ControllerFactory;
