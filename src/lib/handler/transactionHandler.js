"use strict";
const BlockLogger = require("../logger/blockLogger");
function TransactionHandler(blockRepo) {
  function _calculateSaveTimeInSeconds(sTime, eTime) {
    const timeElapsed = eTime - sTime;
    return timeElapsed ? (timeElapsed * 0.001).toFixed(2) : 0;
  }

  function _logSaveProcess(
    chainname,
    height,
    transactions,
    formatingTime,
    sTime,
    eTime
  ) {
    BlockLogger.info({
      message: "block saved",
      data: {
        chainname,
        height,
        transactions,
        formatingTime,
        saveTimeInSeconds: _calculateSaveTimeInSeconds(sTime, eTime),
      },
    });
  }
  async function saveBlockDataWithHash({ blockhash, service }) {
    const blockData = await service.getBlock({ blockhash, verbose: true });
    saveBlockData({ blockData, service });
  }

  async function saveBlockData(blockData, formatingTime) {
    const sTime = Date.now();
    await blockRepo.add(blockData);
    const eTime = Date.now();
    const inserted =
      blockData.tx && blockData.tx.length ? blockData.tx.length : 0;

    _logSaveProcess(
      blockData.chainname,
      blockData.height,
      inserted,
      formatingTime,
      sTime,
      eTime
    );
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
