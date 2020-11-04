const EventEmitter = require("events");

function FullnodeSyncManager() {
  const syncArray = [];
  const events = new EventEmitter();

  function setSynchronizer(sync) {
    syncArray.push(sync);
  }

  function activateAllSynchronizer() {
    syncArray.forEach((sync) => {
      sync.events.addListener(
        "blockchainSynchronized",
        _onBlockchainSynchronized
      );
      sync.BlockRange();
    });
  }

  function _onBlockchainSynchronized(chainname) {
    events.emit("blockchainSynchronized", chainname);
  }

  return { setSynchronizer, activateAllSynchronizer };
}

module.exports = FullnodeSyncManager;
