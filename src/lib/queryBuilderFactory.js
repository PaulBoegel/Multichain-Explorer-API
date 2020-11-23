const BitcoinQueryBuilder = require("./queryBuilder/bitcoinQueryBuilder");
const LitecoinQueryBuilder = require("./queryBuilder/litecoinQueryBuilder");
const DashQueryBuilder = require("./queryBuilder/dashQueryBuilder");
const EthereumQueryBuilder = require("./queryBuilder/ethereumQueryBuilder");

function QueryBuilderFactory() {
  return {
    create(chainname) {
      switch (chainname) {
        case "bitcoin":
          return BitcoinQueryBuilder();
        case "litecoin":
          return LitecoinQueryBuilder();
        case "dash":
          return DashQueryBuilder();
        case "ethereum":
          return EthereumQueryBuilder();
      }
    },
  };
}

module.exports = QueryBuilderFactory;
