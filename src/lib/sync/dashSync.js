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
        chainname: "dash",
      }
    ),
    BitcoinSync
  );
}

module.exports = DashSync;
