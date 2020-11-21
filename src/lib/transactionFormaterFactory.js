const BitcoinTransactionFormater = require("./formater/bitcoinTransactionFormater");
const DashTransactionFormater = require("./formater/dashTransactionFormater");
const EthereumTransactionFormater = require("./formater/ethereumTransactionFormater");
const LitecoinTransactionFormater = require("./formater/litecoinTransactionFormater");

function TransactionFormaterFactory() {
  return {
    create(chainname) {
      switch (chainname) {
        case "bitcoin":
          return BitcoinTransactionFormater();
        case "litecoin":
          return LitecoinTransactionFormater();
        case "dash":
          return DashTransactionFormater();
        case "ethereum":
          return EthereumTransactionFormater();
      }
    },
  };
}

module.exports = TransactionFormaterFactory;
