"use strict";
const BlockLogger = require("../logger/blockLogger");
function TransactionHandler(transactionRepo, blockRepo) {
  async function saveBlockDataWithHash({ blockhash, service }) {
    const blockData = await service.getBlock({ blockhash, verbose: true });
    saveBlockData({ blockData, service });
  }

  async function saveBlockData({ blockData, service }) {
    const { tx, ...data } = blockData;
    tx.map((transaction) => (transaction.chainname = service.chainname));
    await blockRepo.add({
      ...data,
      chainname: service.chainname,
      tx: tx.map((transaction) => {
        return transaction.txid;
      }),
    });
    if (tx.length === 0) return 0;
    const inserted = await transactionRepo.addMany(tx);
    BlockLogger.info({
      message: "block synchronized",
      data: {
        chainname: `${service.chainname}`,
        height: data.height,
        transactions: tx.length,
      },
    });
    return inserted;
  }

  async function getHighestBlockHash(service) {
    let height = 0;
    let blocks = await blockRepo.get({
      query: { chainname: service.chainname },
      sort: { height: -1 },
      limit: 1,
    });
    if (blocks.length > 0) {
      height = blocks[0].height + 1;
    }

    return await service.getBlockHash({ height, verbose: true });
  }

  return {
    saveBlockData,
    saveBlockDataWithHash,
    getHighestBlockHash,
  };
}

module.exports = TransactionHandler;
