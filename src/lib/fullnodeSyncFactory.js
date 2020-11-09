const LitecoinSync = require("./sync/litecoinSync");
const BitcoinSync = require("./sync/bitcoinSync");

function FullnodeSyncFactory({
  fullnodeServiceManager,
  transactionRepo,
  blockRepo,
}) {
  function create(chainname) {
    switch (chainname) {
      case "bitcoin":
      case "litecoin":
        return new LitecoinSync({
          service: fullnodeServiceManager.getService(chainname),
          transRepo: transactionRepo,
          blockRepo,
        });
    }
  }

  return { create };
}

module.exports = FullnodeSyncFactory;
