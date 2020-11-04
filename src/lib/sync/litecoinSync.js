function LitecoinSync({ service, transRepo, blockRepo }) {
  async function _insertTransactions(blockhash) {
    let inserted = 0;
    let next = blockhash;
    do {
      const { height, hash, tx, nextblockhash } = await service.GetBlock({
        blockhash: next,
        verbose: true,
      });
      next = nextblockhash;
      loopHeight = height;
      await blockRepo.Add({
        height,
        hash,
        //tx,
        tx: tx.map((transaction) => {
          return transaction.txid;
        }),
      });
      inserted += await transRepo.AddMany(tx);
      console.log(`syncronized block: ${height}`);
    } while (next);
    return inserted;
  }

  async function _getHighestBlockHash() {
    let height = 0;
    let blocks = await blockRepo.Get({
      sort: { height: -1 },
      limit: 1,
    });
    if (blocks.length > 0) {
      height = blocks[0].height + 1;
    }
    return await service.GetBlockHash({ height, verbose: true });
  }

  async function Blockrange() {
    await transRepo.Connect();
    await blockRepo.Connect();
    const blockhash = await _getHighestBlockHash();
    inserted = await _insertTransactions(blockhash);
    return inserted;
  }

  return { Blockrange };
}

module.exports = LitecoinSync;