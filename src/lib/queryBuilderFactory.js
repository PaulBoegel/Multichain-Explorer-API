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
            blockRepo
          );
        case conf.bitcoin.chainId:
          return LitecoinQueryBuilder(
            formaterManager.getFormater(conf.bitcoin.chainId),
            blockRepo
          );
        case conf.bitcoin.chainId:
          return DashQueryBuilder(
            formaterManager.getFormater(conf.bitcoin.chainId),
            blockRepo
          );
        case conf.bitcoin.chainId:
          return EthereumQueryBuilder(
            formaterManager.getFormater(conf.bitcoin.chainId),
            blockRepo
          );
      }
    },
  };
}

module.exports = QueryBuilderFactory;
