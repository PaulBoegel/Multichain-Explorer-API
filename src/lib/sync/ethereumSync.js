const EventEmitter = require("events");
const BlockLogger = require("../logger/blockLogger");

function EthereumSync({
  service,
  transactionHandler,
  formater,
  syncHeight = null,
  syncHeightActive = false,
}) {
  const blockCach = new Map();
  let lastHeightSaved = 0;

  async function _checkblockCach() {
    const height = lastHeightSaved + 1;
    const block = blockCach.get(height);
    if (!block) return;
    blockCach.delete(height);
    await transactionHandler.saveBlockData(block);
    lastHeightSaved++;
    BlockLogger.info({
      message: "cached block saved",
      data: {
        chainname: block.chainname,
        height: block.height,
        transactions: block.tx.length,
      },
    });
    await _checkblockCach();
  }

  function _endSync(fireEvent) {
    BlockLogger.info({
      message: "blockchain synchronized",
      data: { chainname: `${this.chainname}` },
    });
    if (fireEvent) this.events.emit("blockchainSynchronized", this.chainname);
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

        blockData.chainname = service.chainname;

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

          BlockLogger.info({
            message: "block saved",
            data: {
              chainname: blockData.chainname,
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

  async function _syncData({ startHeight, endHeight }) {
    height = startHeight;
    while (endHeight === undefined || height <= endHeight) {
      const blockhash = await service.getBlockHash({ height, verbose: true });

      if (!blockhash) break;
      if (endHeight & (height === endHeight)) break;

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
    chainname: "ethereum",
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
