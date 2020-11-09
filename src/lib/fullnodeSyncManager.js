function FullnodeSyncManager(notifyManager) {
  const syncArray = [];

  function setSynchronizer(sync) {
    syncArray.push(sync);
  }

  function activateAllSynchronizer() {
    syncArray.forEach(async (sync) => {
      sync.events.addListener(
        "blockchainSynchronized",
        _onBlockchainSynchronized
      );
      await sync.blockrange();
    });
  }

  function _onBlockchainSynchronized(chainname) {
    notifyManager.activateNotifyer(chainname).then();
  }

  return { setSynchronizer, activateAllSynchronizer };
}

module.exports = FullnodeSyncManager;
