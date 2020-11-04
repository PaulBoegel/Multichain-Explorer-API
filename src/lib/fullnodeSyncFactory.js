const LitecoinSync = require("./sync/litecoinSync");

function FullnodeSyncFactory({ serviceManager, transRepo, blockRepo }) {
  function create(chainname) {
    switch (chainname) {
      case "litecoin":
        return new LitecoinSync(
          serviceManager.getService(chainname),
          transRepo,
          blockRepo
        );
        break;
    }
  }

  return { create };
}

module.exports = FullnodeSyncFactory;
