const BitcoinSync = require("./bitcoinSync");

function DashSync({
  service,
  transactionHandler,
  syncHeight = null,
  syncHeightActive = false,
}) {
  return Object.setPrototypeOf(
    Object.assign(
      BitcoinSync({
        service,
        transactionHandler,
        syncHeight,
        syncHeightActive,
      }),
      {
        chainname: "dash",
      }
    ),
    BitcoinSync
  );
}

module.exports = DashSync;
