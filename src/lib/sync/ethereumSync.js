const EventEmitter = require("events");
const BlockLogger = require("../logger/blockLogger");

function EthereumSync({
  service,
  transactionHandler,
  formater,
  syncHeight = null,
  syncHeightActive = false,
}) {
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
      });
  }

  async function _checkHeightConsistency(height) {
    if (!height) return;
    const heightArray = await transactionHandler.getAllBlockHeights(
      service.chainname
    );
    const heightSet = new Set([...heightArray]);

    for (let index = 0; index < height; index++) {
      if (heightSet.has(index)) continue;
      const blockhash = await service.getBlockHash({
        height: index,
      });
      _saveBlockData.call(this, blockhash);
    }
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
      await _checkHeightConsistency.call(this, height);
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
