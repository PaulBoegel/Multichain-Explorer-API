function FullnodeSyncManager(notifyManager) {
  const syncArray = [];

  function setSynchronizer(sync) {
    syncArray.push(sync);
  }

  async function activateAllSynchronizer() {
    for (sync of syncArray) {
      sync.events.addListener(
        "blockchainSynchronized",
        _onBlockchainSynchronized
      );
      await sync.blockrange();
    }
  }

  function _onBlockchainSynchronized(chainname) {
    notifyManager.activateNotifyer(chainname).then();
  }

  return { setSynchronizer, activateAllSynchronizer };
}

module.exports = FullnodeSyncManager;
