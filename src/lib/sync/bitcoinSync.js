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
  function _endSync() {
    BlockLogger.info({
      message: "blockchain synchronized",
      data: { chainname: `${this.chainname}` },
    });
    this.events.emit("blockchainSynchronized", this.chainname);
  }

  async function _syncDataWithHeight({ nextHash }) {
    while (true) {
      const blockData = await service.getBlock({
        blockhash: nextHash,
        verbose: true,
      });

      if (blockData.height > syncHeight) break;

      blockData.tx.forEach((transaction) => {
        formater.formatForDB(transaction);
      });

      blockData.chainname = service.chainname;

      await transactionHandler.saveBlockData(blockData);

      nextHash = blockData.nextblockhash;
    }

    _endSync.call(this);

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

    _endSync.call(this);
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
