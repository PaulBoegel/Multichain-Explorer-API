const BitcoinSync = require("./bitcoinSync");

function DashSync({
  service,
  transactionHandler,
  formater,
  endHeight = null,
  runSync = false,
}) {
  return Object.setPrototypeOf(
    Object.assign(
      BitcoinSync({
        service,
        transactionHandler,
        formater,
        endHeight,
        runSync,
      }),
      {
        chainId: service.chainId,
      }
    ),
    BitcoinSync
  );
}

module.exports = DashSync;
