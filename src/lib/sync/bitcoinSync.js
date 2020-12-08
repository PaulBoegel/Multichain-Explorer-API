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

  async function _syncData({ startHeight, endHeight }) {
    let height = startHeight;
    while (endHeight === undefined || height < endHeight) {
      const sRequestTime = Date.now();
      const blockhash = await service.getBlockHash({ height, verbose: true });
      if (!blockhash) break;
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
    chainname: "bitcoin",
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
