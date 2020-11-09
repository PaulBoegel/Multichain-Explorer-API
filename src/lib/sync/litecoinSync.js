const EventEmitter = require("events");

function LitecoinSync({ service, transRepo, blockRepo }) {
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

  async function _getHighestBlockHash() {
    let height = 0;
    let blocks = await blockRepo.get({
      sort: { height: -1 },
      limit: 1,
    });
    if (blocks.length > 0) {
      height = blocks[0].height + 1;
    }

    return await service.getBlockHash({ height, verbose: true });
  }

  async function _checkHeight(endHeight) {
    if (typeof endHeight === "number") return endHeight;
    return ({ blocks } = await service.getBlockchainInfo());
  }

  async function blockrange(endHeight = null) {
    await transRepo.connect();
    await blockRepo.connect();
    const nextHash = await _getHighestBlockHash();
    endHeight = await _checkHeight(endHeight);
    inserted = await _insertTransactions({ nextHash, endHeight });
    return inserted;
  }

  return { blockrange, events };
}

module.exports = LitecoinSync;
