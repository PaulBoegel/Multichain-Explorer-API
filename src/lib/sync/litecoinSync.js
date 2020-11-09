const EventEmitter = require("events");

function LitecoinSync({ service, transactionHandler }) {
  const events = new EventEmitter();
  const CHAINNAME = "litecoin";

  async function _insertTransactions({ nextHash, endHeight }) {
    let inserted = 0;
    let currentBlockHeight = 0;
    do {
      const { height, hash, tx, nextblockhash } = await service.getBlock({
        blockhash: nextHash,
        verbose: true,
      });
      if (height > endHeight) break;
      currentBlockHeight = height;
      nextHash = nextblockhash;
      await blockRepo.add({
        height,
        hash,
        //tx,
        tx: tx.map((transaction) => {
          return transaction.txid;
        }),
        chainname: CHAINNAME,
      });
      tx.map((transaction) => (transaction.chainname = CHAINNAME));
      inserted += await transRepo.addMany(tx);
      // console.log(`syncronized block: ${height}`);
    } while (nextHash);
    events.emit("blockchainSynchronized", CHAINNAME);
    return inserted;
  }

  async function _checkHeight(endHeight) {
    if (typeof endHeight === "number") return endHeight;
    return ({ blocks } = await service.getBlockchainInfo());
  }

  async function blockrange(endHeight = null) {
    const nextHash = await transactionHandler.getHighestBlockHash(service);
    endHeight = await _checkHeight(endHeight);
    inserted = await _insertTransactions({ nextHash, endHeight });
    return inserted;
  }

  return { blockrange, events };
}

module.exports = LitecoinSync;
