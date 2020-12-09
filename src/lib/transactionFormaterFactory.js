const BitcoinTransactionFormater = require("./formater/bitcoinTransactionFormater");
const DashTransactionFormater = require("./formater/dashTransactionFormater");
const EthereumTransactionFormater = require("./formater/ethereumTransactionFormater");
const LitecoinTransactionFormater = require("./formater/litecoinTransactionFormater");

function TransactionFormaterFactory(conf) {
  return {
    create(chainId) {
      switch (chainId) {
        case conf.bitcoin.chainId:
          return BitcoinTransactionFormater(conf.bitcoin.chainId);
        case conf.litecoin.chainId:
          return LitecoinTransactionFormater(conf.litecoin.chainId);
        case conf.dash.chainId:
          return DashTransactionFormater(conf.dash.chainId);
        case conf.ethereum.chainId:
          return EthereumTransactionFormater(conf.ethereum.chainId);
      }
    },
  };
}

module.exports = TransactionFormaterFactory;
