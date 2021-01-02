const BitcoinSync = require("./bitcoinSync");

function LitecoinSync({
  service,
  dataHandler,
  formater,
  endHeight = null,
  runSync = false,
}) {
  return Object.setPrototypeOf(
    Object.assign(
      BitcoinSync({
        service,
        dataHandler,
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

module.exports = LitecoinSync;
