const EventEmitter = require("events");

function LitecoinSync({ service, transRepo, blockRepo }) {
  const events = new EventEmitter();

  async function _insertTransactions(blockhash) {
    let inserted = 0;
    let next = blockhash;
    do {
      const { height, hash, tx, nextblockhash } = await service.getBlock({
        blockhash: next,
        verbose: true,
      });
      next = nextblockhash;
      loopHeight = height;
      await blockRepo.add({
        height,
        hash,
        //tx,
        tx: tx.map((transaction) => {
          return transaction.txid;
        }),
      });
      inserted += await transRepo.addMany(tx);
      console.log(`syncronized block: ${height}`);
    } while (next);
    events.emit("blockchainSynchronized", "litecoin");
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
    const blockhash = await _getHighestBlockHash();
    endHeight = await _checkHeight(endHeight);
    inserted = await _insertTransactions(blockhash);
    return inserted;
  }

  return { blockrange, events };
}

module.exports = LitecoinSync;
