const EventEmitter = require("events");
const { ExceptionHandler } = require("winston");
const BlockLogger = require("../logger/blockLogger");

function DashSync({
  service,
  transactionHandler,
  syncHeight = null,
  syncHeightActive = false,
}) {
  const events = new EventEmitter();
  const CHAINNAME = "dash";

  function setSyncHeight(height) {
    syncHeight = height;
  }

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
      BlockLogger.info({
        message: "block synchronized",
        data: {
          chainname: `${CHAINNAME}`,
          height: blockData.height,
          transactions: blockData.tx.length,
        },
      });
      nextHash = blockData.nextblockhash;
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
      nextHash = blockData.nextblockhash;
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

module.exports = DashSync;
