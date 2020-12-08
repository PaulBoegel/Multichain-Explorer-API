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

      nextHash = await service.getBlockHash({ height: blockData.height + 1 });
    }
    _endSync.call(this, false);
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
      nextHash = await service.getBlockHash({ height: blockData.height + 1 });
    } while (nextHash);
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
      const nextHash = await transactionHandler.getHighestBlockHash(service);
      if ((await _checkHeight.call(this, syncHeight)) && syncHeightActive) {
        return await _syncDataWithHeight.call(this, { nextHash });
      }
      return _syncData.call(this, { nextHash });
    },
  };
}

module.exports = EthereumSync;
