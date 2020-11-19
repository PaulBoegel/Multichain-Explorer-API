const BitcoinSync = require("./bitcoinSync");

function LitecoinSync({
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
        chainname: "litecoin",
      }
    ),
    BitcoinSync
  );
}

module.exports = LitecoinSync;
