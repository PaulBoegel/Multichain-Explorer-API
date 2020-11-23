const BitcoinQueryBuilder = require("./queryBuilder/bitcoinQueryBuilder");
const LitecoinQueryBuilder = require("./queryBuilder/litecoinQueryBuilder");
const DashQueryBuilder = require("./queryBuilder/dashQueryBuilder");
const EthereumQueryBuilder = require("./queryBuilder/ethereumQueryBuilder");

function QueryBuilderFactory(formaterManager, transRepo) {
  return {
    create(chainname) {
      switch (chainname) {
        case "bitcoin":
          return BitcoinQueryBuilder(
            formaterManager.getFormater("bitcoin"),
            transRepo
          );
        case "litecoin":
          return LitecoinQueryBuilder(
            formaterManager.getFormater("litecoin"),
            transRepo
          );
        case "dash":
          return DashQueryBuilder(
            formaterManager.getFormater("dash"),
            transRepo
          );
        case "ethereum":
          return EthereumQueryBuilder(
            formaterManager.getFormater("ethereum"),
            transRepo
          );
      }
    },
  };
}

module.exports = QueryBuilderFactory;
