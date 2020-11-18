const EventEmitter = require("events");
const BlockLogger = require("../logger/blockLogger");

function EthereumSync({
  service,
  transactionHandler,
  syncHeight = null,
  syncHeightActive = false,
}) {
  const events = new EventEmitter();
  const CHAINNAME = "ethereum";

  function setSyncHeight({ height, active }) {
    syncHeight = height;
    syncHeightActive = true;
  }

  async function _syncDataWithHeight({ nextHash }) {
    let inserted = 0;
    while (true) {
      const blockData = await service.getBlock({
        blockhash: nextHash,
        verbose: true,
      });
      if (blockData.number > syncHeight) break;
      inserted = await transactionHandler.saveBlockData({
        blockData,
        service,
      });
      BlockLogger.info({
        message: "block synchronized",
        data: {
          chainname: `${CHAINNAME}`,
          height: blockData.number,
          transactions: blockData.tx.length,
        },
      });
      nextHash = await service.getBlockHash({ height: blockData.number + 1 });
    }
    BlockLogger.info({
      message: "blockchain synchronized",
      data: { chainname: `${CHAINNAME}`, transactions: inserted },
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
      BlockLogger.info({
        message: "block synchronized",
        data: {
          chainname: `${CHAINNAME}`,
          height: blockData.height,
          transactions: blockData.tx.length,
        },
      });
      nextHash = service.getBlockHash({ height: blockData.number + 1 });
    } while (nextHash);
    BlockLogger.info({
      message: "blockchain synchronized",
      data: { chainname: `${CHAINNAME}`, transactions: inserted },
    });
    events.emit("blockchainSynchronized", CHAINNAME);
    return inserted;
  }

  async function blockrange() {
    const nextHash = await transactionHandler.getHighestBlockHash(service);
    if ((await _checkHeight(syncHeight)) && syncHeightActive) {
      return await _syncDataWithHeight({ nextHash });
    }
    return _syncData({ nextHash });
  }

  async function _checkHeight(endHeight) {
    if (typeof endHeight === "number") return true;
    return false;
  }

  return { blockrange, setSyncHeight, events };
}

module.exports = EthereumSync;
