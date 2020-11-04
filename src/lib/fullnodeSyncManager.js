function FullnodeSyncManager(notifyManager) {
  const syncArray = [];

  function setSynchronizer(sync) {
    syncArray.push(sync);
  }

  function activateAllSynchronizer() {
    console.log(syncArray);
    syncArray.forEach(async (sync) => {
      sync.events.addListener(
        "blockchainSynchronized",
        _onBlockchainSynchronized
      );
      await sync.blockrange(100);
    });
  }

  function _onBlockchainSynchronized(chainname) {
    notifyManager.activateNotifyer(chainname);
  }

  return { setSynchronizer, activateAllSynchronizer };
}

module.exports = FullnodeSyncManager;
