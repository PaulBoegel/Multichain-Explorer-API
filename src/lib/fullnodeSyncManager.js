function FullnodeSyncManager(notifyManager) {
  const syncArray = [];

  function setSynchronizer(sync) {
    syncArray.push(sync);
  }

  async function activateAllSynchronizer() {
    const blockrangePromises = [];
    for (sync of syncArray) {
      sync.events.addListener(
        "blockchainSynchronized",
        _onBlockchainSynchronized
      );
      blockrangePromises.push(sync.blockrange());
    }
    await Promise.all(blockrangePromises);
  }

  function _onBlockchainSynchronized(chainId) {
    notifyManager.activateNotifyer(chainId).then();
  }

  return { setSynchronizer, activateAllSynchronizer };
}

module.exports = FullnodeSyncManager;
