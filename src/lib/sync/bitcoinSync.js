"use strict";
const EventEmitter = require("events");
const BlockLogger = require("../logger/blockLogger");

function BitcoinSync({
  service,
  transactionHandler,
  formater,
  syncHeight = null,
  syncHeightActive = false,
}) {
  const blockcache = new Map();
  let lastHeightSaved = 0;
  let cacheSize = 10000;

  function _endSync(fireEvent) {
    BlockLogger.info({
      message: "blockchain synchronized",
      data: { chainId: `${this.chainId}` },
    });
    if (fireEvent) this.events.emit("blockchainSynchronized", this.chainId);
  }

  function _checkblockcache() {
    let height = lastHeightSaved + 1;
    const saveBlocks = [];
    let block;
    while (true) {
      block = blockcache.get(height);
      if (block) {
        if (block.height <= lastHeightSaved) {
          console.log("deleted from cache: " + block.height);
          blockcache.delete(height);
          height++;
          continue;
        }
        saveBlocks.push(block);
        blockcache.delete(height);
        height++;
        continue;
      }
      break;
    }
    if (saveBlocks.length === 0) return;
    const sTime = Date.now();
    transactionHandler.saveBlockDataMany(saveBlocks).then(async (result) => {
      const eTime = Date.now();
      const formatingTime = _calculateSaveTimeInSeconds(sTime, eTime);
      lastHeightSaved = Math.max(...saveBlocks.map((block) => block.height));
      BlockLogger.info({
        message: "cached blocks saved",
        data: {
          blockHeight: lastHeightSaved,
          count: saveBlocks.length,
          saveTime: formatingTime,
        },
      });
      await _checkblockcache();
    });
  }

  function _saveBlockData(blockhash) {
    const sRequestTime = Date.now();
    service
      .getBlock({
        blockhash,
        verbose: true,
      })
      .then(async (blockData) => {
        const eRequestTime = Date.now();
        const sFormatTime = Date.now();
        blockData.tx.forEach((transaction) => {
          formater.formatForDB(transaction);
        });
        const eFormatTime = Date.now();

        blockData.chainId = service.chainId;

        const requestTime = _calculateSaveTimeInSeconds(
          sRequestTime,
          eRequestTime
        );
        const formatingTime = _calculateSaveTimeInSeconds(
          sFormatTime,
          eFormatTime
        );

        if (blockcache.size > 0)
          await _checkblockcache(blockcache, lastHeightSaved);

        if (blockData.height - 1 === lastHeightSaved || lastHeightSaved === 0) {
          const saveTime = await transactionHandler.saveBlockData(blockData);
          lastHeightSaved = blockData.height;

          BlockLogger.info({
            message: "block saved",
            data: {
              chainId: blockData.chainId,
              height: lastHeightSaved,
              transactions: blockData.tx.length,
              requestTime,
              formatingTime,
              saveTime,
            },
          });
          return;
        }

        if (blockcache.has(blockData.height)) return;
        blockcache.set(blockData.height, blockData);
        BlockLogger.info({
          message: "block saved in cache",
          data: {
            chainId: blockData.chainId,
            height: blockData.height,
            transactions: blockData.tx.length,
            cacheCount: blockcache.size,
            blockHeight: lastHeightSaved,
          },
        });
      });
  }

  function _calculateSaveTimeInSeconds(sTime, eTime) {
    const timeElapsed = eTime - sTime;
    return timeElapsed ? (timeElapsed * 0.001).toFixed(2) : 0;
  }

  async function _syncData({ startHeight, endHeight }) {
    let height = startHeight;
    lastHeightSaved = startHeight;
    while (endHeight === undefined || height <= endHeight) {
      const blockhash = await service.getBlockHash({ height });
      if (!blockhash) break;

      _saveBlockData.call(this, blockhash);

      if (blockcache.size > cacheSize) {
        console.log(lastHeightSaved);
        const blockhash = await service.getBlockHash({
          height: lastHeightSaved,
        });
        _saveBlockData.call(this, blockhash);
        return;
      }
      height += 1;
    }

    _endSync.call(this, true);
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
      return _syncData.call(this, { startHeight: height });
    },
  };
}

module.exports = BitcoinSync;
