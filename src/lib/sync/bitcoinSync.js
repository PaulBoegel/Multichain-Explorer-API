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
  const blockCach = new Map();
  let lastHeightSaved = 0;

  function _endSync(fireEvent) {
    BlockLogger.info({
      message: "blockchain synchronized",
      data: { chainId: `${this.chainId}` },
    });
    if (fireEvent) this.events.emit("blockchainSynchronized", this.chainId);
  }

  async function _checkblockCach() {
    let height = lastHeightSaved + 1;
    const saveBlocks = [];
    let block;
    while (true) {
      block = blockCach.get(height);
      if (block) {
        saveBlocks.push(block);
        blockCach.delete(height);
        height++;
        continue;
      }
      break;
    }
    if (saveBlocks.length === 0) return;
    await transactionHandler.saveBlockDataMany(saveBlocks);
    const [lastBlock] = saveBlocks.slice(-1);
    lastHeightSaved = lastBlock.height;
    BlockLogger.info({
      message: "cached blocks saved",
      data: {
        count: saveBlocks.length,
      },
    });
    await _checkblockCach();
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

        if (blockCach.size > 0)
          await _checkblockCach(blockCach, lastHeightSaved);

        if (blockData.height - 1 === lastHeightSaved || lastHeightSaved === 0) {
          const saveTime = await transactionHandler.saveBlockData(blockData);
          lastHeightSaved = blockData.height;
          BlockLogger.info({
            message: "block saved",
            data: {
              chainId: blockData.chainId,
              height: blockData.height,
              transactions: blockData.tx.length,
              requestTime,
              formatingTime,
              saveTime,
            },
          });
          return;
        }

        blockCach.set(blockData.height, blockData);
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
      const blockhash = await service.getBlockHash({ height, verbose: true });
      if (!blockhash) break;

      _saveBlockData.call(this, blockhash, height);

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
