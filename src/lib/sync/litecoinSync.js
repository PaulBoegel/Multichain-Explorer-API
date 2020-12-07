const BitcoinSync = require("./bitcoinSync");

function LitecoinSync({
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
        chainname: "litecoin",
      }
    ),
    BitcoinSync
  );
}

module.exports = LitecoinSync;
