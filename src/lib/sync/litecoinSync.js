const EventEmitter = require("events");

function LitecoinSync({ service, transactionHandler }) {
  const events = new EventEmitter();
  const CHAINNAME = "litecoin";

  async function _insertTransactions({ nextHash, endHeight }) {
    let inserted = 0;
    do {
      const blockData = await _getBlockData(nextHash);
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

  async function blockrange(endHeight = null) {
    const nextHash = await transactionHandler.getHighestBlockHash(service);
    endHeight = await _checkHeight(endHeight);
    inserted = await _insertTransactions({ nextHash, endHeight });
    return inserted;
  }

  async function _getBlockData(blockhash) {
    return ({ height, hash, tx, nextblockhash } = await service.getBlock({
      blockhash,
      verbose: true,
    }));
  }

  async function _checkHeight(endHeight) {
    if (typeof endHeight === "number") return endHeight;
    return ({ blocks } = await service.getBlockchainInfo());
  }

  return { blockrange, events };
}

module.exports = LitecoinSync;
