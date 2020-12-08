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

  async function _syncDataWithHeight({ nextHash }) {
    while (true) {
      const blockData = await service.getBlock({
        blockhash: nextHash,
        verbose: true,
      });

      if (blockData.height > syncHeight) break;

      const sTime = Date.now();
      blockData.tx.forEach((transaction) => {
        formater.formatForDB(transaction);
      });
      const eTime = Date.now();

      const formatingTime = _calculateSaveTimeInSeconds(sTime, eTime);

      blockData.chainname = service.chainname;

      await transactionHandler.saveBlockData(blockData, formatingTime);

      nextHash = blockData.nextblockhash;
    }

    _endSync.call(this, false);

    return true;
  }

  async function _syncData({ nextHash }) {
    do {
      const blockData = await service.getBlock({
        blockhash: nextHash,
        verbose: true,
      });

      blockData.tx.forEach((transaction) => {
        formater.formatForDB(transaction);
      });

      blockData.chainname = service.chainname;
      await transactionHandler.saveBlockData(blockData);

      nextHash = blockData.nextblockhash;
      nextHash = blockData.nextblockhash;
    } while (nextHash);

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
      const nextHash = await transactionHandler.getHighestBlockHash(service);
      if ((await _checkHeight.call(this, syncHeight)) && syncHeightActive) {
        return await _syncDataWithHeight.call(this, { nextHash });
      }
      return _syncData.call(this, { nextHash });
    },
  };
}

module.exports = BitcoinSync;
