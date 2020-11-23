"use strict";
const BlockLogger = require("../logger/blockLogger");
function TransactionHandler(
  transactionRepo,
  blockRepo,
  transactionFormaterManager
) {
  function _calculateSaveTimeInSeconds(sTime, eTime) {
    const timeElapsed = eTime - sTime;
    return timeElapsed ? (timeElapsed * 0.001).toFixed(2) : 0;
  }

  function _logSaveProcess(chainname, height, transactions, sTime, eTime) {
    BlockLogger.info({
      message: "block saved",
      data: {
        chainname,
        height,
        transactions,
        saveTimeInSeconds: _calculateSaveTimeInSeconds(sTime, eTime),
      },
    });
  }
  async function saveBlockDataWithHash({ blockhash, service }) {
    const blockData = await service.getBlock({ blockhash, verbose: true });
    saveBlockData({ blockData, service });
  }

  async function saveBlockData({ blockData, service }) {
    const { tx, ...data } = blockData;
    const sTime = Date.now();
    tx.map((transaction) => (transaction.chainname = service.chainname));
    await blockRepo.add({
      ...data,
      chainname: service.chainname,
      tx: tx.map((transaction) => {
        return transaction.txid;
      }),
    });
    if (tx.length === 0) {
      _logSaveProcess(service.chainname, data.height, 0, sTime, Date.now());
      return 0;
    }

    const formater = transactionFormaterManager.getFormater(service.chainname);
    const transactions = [];

    for (let transaction of tx) {
      formater.formatForDB(transaction);
      await formater.formatAccountStructure(transaction, transactionRepo);
      transactions.push(transaction);
    }

    const inserted = await transactionRepo.addMany(transactions);
    _logSaveProcess(
      service.chainname,
      data.height,
      inserted,
      sTime,
      Date.now()
    );
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
