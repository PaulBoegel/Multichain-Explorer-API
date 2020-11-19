const EventEmitter = require("events");
const BlockLogger = require("../logger/blockLogger");

function EthereumSync({
  service,
  transactionHandler,
  syncHeight = null,
  syncHeightActive = false,
}) {
  async function _syncDataWithHeight({ nextHash }) {
    let inserted = 0;
    while (true) {
      const blockData = await service.getBlock({
        blockhash: nextHash,
        verbose: true,
      });
      if (blockData.height > syncHeight) break;
      inserted = await transactionHandler.saveBlockData({
        blockData,
        service,
      });
      nextHash = await service.getBlockHash({ height: blockData.height + 1 });
    }
    BlockLogger.info({
      message: "blockchain synchronized",
      data: { chainname: `${this.chainname}`, transactions: inserted },
    });
    return inserted;
  }

  async function _syncData({ nextHash }) {
    let inserted = 0;
    do {
      const blockData = await service.getBlock({
        blockhash: nextHash,
        verbose: true,
      });
      inserted = await transactionHandler.saveBlockData({
        blockData,
        service,
      });
      nextHash = await service.getBlockHash({ height: blockData.height + 1 });
    } while (nextHash);
    BlockLogger.info({
      message: "blockchain synchronized",
      data: { chainname: `${this.chainname}`, transactions: inserted },
    });
    this.events.emit("blockchainSynchronized", this.chainname);
    return inserted;
  }

  async function _checkHeight(endHeight) {
    if (typeof endHeight === "number") return true;
    return false;
  }

  return {
    chainname: "ethereum",
    events: new EventEmitter(),
    setSyncHeight({ height, active }) {
      syncHeight = height;
      syncHeightActive = true;
    },
    async blockrange() {
      const nextHash = await transactionHandler.getHighestBlockHash(service);
      if ((await _checkHeight.call(this, syncHeight)) && syncHeightActive) {
        return await _syncDataWithHeight.call(this, { nextHash });
      }
      return _syncData.call(this, { nextHash });
    },
  };
}

module.exports = EthereumSync;
