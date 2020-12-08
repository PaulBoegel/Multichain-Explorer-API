"use strict";

function TransactionHandler(blockRepo) {
  function _calculateSaveTimeInSeconds(sTime, eTime) {
    const timeElapsed = eTime - sTime;
    return timeElapsed ? (timeElapsed * 0.001).toFixed(2) : 0;
  }

  async function saveBlockDataWithHash({ blockhash, service }) {
    const blockData = await service.getBlock({ blockhash, verbose: true });
    saveBlockData({ blockData, service });
  }

  async function saveBlockData(blockData) {
    const sTime = Date.now();
    await blockRepo.add(blockData);
    const eTime = Date.now();

    return _calculateSaveTimeInSeconds(sTime, eTime);
  }

  async function getHighestBlock(service) {
    let [block] = await blockRepo.get({
      query: { chainname: service.chainname },
      sort: { height: -1 },
      limit: 1,
    });
    if (!block) {
      const blockhash = await service.getBlockHash({
        height: 0,
        verbose: true,
      });
      block = await service.getBlock({ blockhash, verbose: true });
    }

    return block;
  }

  return {
    saveBlockData,
    saveBlockDataWithHash,
    getHighestBlock,
  };
}

module.exports = TransactionHandler;
