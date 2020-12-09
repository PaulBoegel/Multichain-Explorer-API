const BitcoinSync = require("./bitcoinSync");

function DashSync({
  service,
  transactionHandler,
  formater,
  syncHeight = null,
  syncHeightActive = false,
}) {
  return Object.setPrototypeOf(
    Object.assign(
      BitcoinSync({
        service,
        transactionHandler,
        formater,
        syncHeight,
        syncHeightActive,
      }),
      {
        chainId: service.chainId,
      }
    ),
    BitcoinSync
  );
}

module.exports = DashSync;
