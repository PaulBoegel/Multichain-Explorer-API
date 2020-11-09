const EventEmitter = require("events");

function DashSync({ service, transactionHandler, syncHeight = null }) {
  const events = new EventEmitter();
  const CHAINNAME = "dash";

  function setSyncHeight(height) {
    syncHeight = height;
  }

  async function _insertTransactions({ nextHash, endHeight }) {
    let inserted = 0;
    do {
      const blockData = await service.getBlock({
        blockhash: nextHash,
        verbose: true,
      });
      inserted = await transactionHandler.saveBlockData({
        blockData,
        service,
      });
      nextHash = blockData.nextblockhash;

      if (blockData.height > endHeight) break;
    } while (nextHash);
    events.emit("blockchainSynchronized", CHAINNAME);
    return inserted;
  }

  async function blockrange() {
    const nextHash = await transactionHandler.getHighestBlockHash(service);
    endHeight = await _checkHeight(syncHeight);
    inserted = await _insertTransactions({ nextHash, endHeight });
    return inserted;
  }

  async function _checkHeight(endHeight) {
    if (typeof endHeight === "number") return endHeight;
    return ({ blocks } = await service.getBlockchainInfo());
  }

  return { blockrange, setSyncHeight, events };
}

module.exports = DashSync;
