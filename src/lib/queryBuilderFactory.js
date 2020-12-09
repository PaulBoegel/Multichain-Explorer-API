const BitcoinQueryBuilder = require("./queryBuilder/bitcoinQueryBuilder");
const LitecoinQueryBuilder = require("./queryBuilder/litecoinQueryBuilder");
const DashQueryBuilder = require("./queryBuilder/dashQueryBuilder");
const EthereumQueryBuilder = require("./queryBuilder/ethereumQueryBuilder");

function QueryBuilderFactory(formaterManager, blockRepo, conf) {
  return {
    create(chainId) {
      switch (chainId) {
        case conf.bitcoin.chainId:
          return BitcoinQueryBuilder(
            formaterManager.getFormater(conf.bitcoin.chainId),
            blockRepo,
            conf.bitcoin.chainId
          );
        case conf.litecoin.chainId:
          return LitecoinQueryBuilder(
            formaterManager.getFormater(conf.litecoin.chainId),
            blockRepo,
            conf.litecoin.chainId
          );
        case conf.dash.chainId:
          return DashQueryBuilder(
            formaterManager.getFormater(conf.litecoin.chainId),
            blockRepo,
            conf.dash.chainId
          );
        case conf.ethereum.chainId:
          return EthereumQueryBuilder(
            formaterManager.getFormater(conf.ethereum.chainId),
            blockRepo,
            conf.ethereum.chainId
          );
      }
    },
  };
}

module.exports = QueryBuilderFactory;
