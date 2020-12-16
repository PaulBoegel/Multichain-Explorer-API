const EventEmitter = require("events");
const BlockLogger = require("../logger/blockLogger");

function EthereumSync({
  service,
  transactionHandler,
  formater,
  syncHeight = null,
  syncHeightActive = false,
}) {
  const blockcache = new Map();
  let lastHeightSaved = 0;
  let transactionsCached = 0;

  async function _checkblockCache() {
    const saveBlocks = [];
    let height = lastHeightSaved + 1;
    let transactionsSaved = 0;
    let block;

    while (true) {
      block = blockcache.get(height);
      if (block) {
        saveBlocks.push(block);
        transactionsSaved += block.tx.length;
        blockcache.delete(height);
        if (transactionsSaved > 100000) break;
        height++;
        continue;
      }
      break;
    }
    if (saveBlocks.length === 0) return;
    const sTime = Date.now();
    await transactionHandler.saveBlockDataMany(saveBlocks);
    transactionsCached -= transactionsSaved;
    const eTime = Date.now();
    const formatingTime = _calculateSaveTimeInSeconds(sTime, eTime);
    lastHeightSaved = saveBlocks.slice(-1)[0].height;
    BlockLogger.info({
      message: "cached blocks saved",
      data: {
        blockHeight: lastHeightSaved,
        count: saveBlocks.length,
        transactionsSaved: transactionsSaved,
        saveTime: formatingTime,
      },
    });
    await _checkblockCache();
  }

  function _endSync(fireEvent) {
    BlockLogger.info({
      message: "blockchain synchronized",
      data: { chainId: `${this.chainId}` },
    });
    if (fireEvent) this.events.emit("blockchainSynchronized", this.chainId);
  }

  function _calculateSaveTimeInSeconds(sTime, eTime) {
    const timeElapsed = eTime - sTime;
    return timeElapsed ? (timeElapsed * 0.001).toFixed(2) : 0;
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

        if (blockcache.size > 0) await _checkblockCache();

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

        if (
          blockcache.has(blockData.height) ||
          blockData.height <= lastHeightSaved
        )
          return;

        transactionsCached += blockData.tx.length;
        blockcache.set(blockData.height, blockData);
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
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function _syncData({ startHeight, endHeight }) {
    height = startHeight;
    while (endHeight === undefined || height <= endHeight) {
      const blockhash = await service.getBlockHash({ height, verbose: true });

      if (!blockhash) break;
      if (endHeight & (height === endHeight)) break;

      if (transactionsCached > 20000) {
        await _checkblockCach();
        continue;
      }

      _saveBlockData.call(this, blockhash);

      height += 1;
    }
    _endSync.call(this, true);
  }

  async function _checkHeight(endHeight) {
    if (typeof endHeight === "number") return true;
    return false;
  }

  return {
    chainId: service.chainId,
    events: new EventEmitter(),
    setSyncHeight({ height, active }) {
      syncHeight = height;
      syncHeightActive = true;
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

module.exports = EthereumSync;
