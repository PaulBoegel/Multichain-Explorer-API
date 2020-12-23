"use strict";
const EventEmitter = require("events");
const BlockLogger = require("../logger/blockLogger");
const OUT_OF_RANGE = "Block height out of range";

function BitcoinSync({
  service,
  transactionHandler,
  formater,
  syncHeight = null,
  syncHeightActive = false,
}) {
  const blockcache = new Map();
  let lastHeightSaved = 0;
  let transactionsCached = 0;
  let startNotifyer = false;

  function _endSync(fireEvent) {
    BlockLogger.info({
      message: "blockchain synchronized",
      data: { chainId: `${this.chainId}` },
    });
    if (fireEvent) this.events.emit("blockchainSynchronized", this.chainId);
  }

  async function _checkblockcache() {
    const saveBlocks = [];
    let height = lastHeightSaved + 1;
    let transactionsSaved = 0;
    let saveHeight = 0;
    let block;

    while (true) {
      block = blockcache.get(height);
      if (block) {
        saveBlocks.push(block);
        saveHeight = block.height;
        blockcache.delete(height);
        if (block.tx) transactionsSaved += block.tx.length;
        if (transactionsCached > 10000) break;
        height++;
        continue;
      }
      break;
    }
    if (saveBlocks.length === 0) return;
    await transactionHandler.saveBlockDataMany(saveBlocks);
    transactionsCached -= transactionsSaved;
    lastHeightSaved = saveHeight;
    await _checkblockcache();
  }

  function _saveBlockData(blockhash) {
    service
      .getBlock({
        blockhash,
        verbose: true,
      })
      .then(async (blockData) => {
        blockData.chainId = service.chainId;

        if (blockcache.size > 0) _checkblockcache();

        if (blockData.height - 1 === lastHeightSaved || lastHeightSaved === 0) {
          const saveTime = await transactionHandler.saveBlockData(blockData);
          lastHeightSaved = blockData.height;
          return;
        }

        if (
          blockcache.has(blockData.height) ||
          blockData.height <= lastHeightSaved
        )
          return;
        transactionsCached += blockData.tx.length;
        blockcache.set(blockData.height, blockData);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function _syncData({ startHeight, endHeight }) {
    try {
      let height = startHeight;
      lastHeightSaved = startHeight;
      while (endHeight === undefined || height <= endHeight) {
        const blockhash = await service.getBlockHash({ height });
        if (!blockhash) break;

        if (transactionsCached > 20000) {
          await _checkblockcache();
          continue;
        }

        _saveBlockData.call(this, blockhash);
        height += 1;
      }
    } catch (err) {
      if (err.message === OUT_OF_RANGE) {
        _endSync.call(this, startNotifyer);
      }
    }
  }

  function _checkHeight(endHeight) {
    if (typeof endHeight === "number") return true;
    return false;
  }

  return {
    events: new EventEmitter(),
    chainId: service.chainId,
    setSyncHeight(height) {
      syncHeight = height;
    },
    async blockrange() {
      const { height } = await transactionHandler.getHighestBlock(service);
      if ((await _checkHeight.call(this, syncHeight)) && syncHeightActive) {
        return await _syncData.call(this, {
          startHeight: height,
          endHeight: syncHeight,
        });
      }
      startNotifyer = true;
      return _syncData.call(this, { startHeight: height, startNotifyer: true });
    },
  };
}

module.exports = BitcoinSync;
