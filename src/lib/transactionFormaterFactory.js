const BitcoinTransactionFormater = require("./formater/bitcoinTransactionFormater");
const DashTransactionFormater = require("./formater/dashTransactionFormater");
const EthereumTransactionFormater = require("./formater/ethereumTransactionFormater");
const LitecoinTransactionFormater = require("./formater/litecoinTransactionFormater");

function TransactionFormaterFactory(conf) {
  return {
    create(chainId) {
      switch (chainId) {
        case conf.bitcoin.chainId:
          return BitcoinTransactionFormater();
        case conf.litecoin.chainId:
          return LitecoinTransactionFormater();
        case conf.dash.chainId:
          return DashTransactionFormater();
        case conf.ethereum.chainId:
          return EthereumTransactionFormater();
      }
    },
  };
}

module.exports = TransactionFormaterFactory;
