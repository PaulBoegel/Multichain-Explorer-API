"use strict";

function TransactionHandler(blockRepo) {
  function _calculateSaveTimeInSeconds(sTime, eTime) {
    const timeElapsed = eTime - sTime;
    return timeElapsed ? (timeElapsed * 0.001).toFixed(2) : 0;
  }

  async function saveBlockDataWithHash({ blockhash, service }) {
    const blockData = await service.getBlock({ blockhash, verbose: true });
    blockData.chainId = service.chainId;
    saveBlockData(blockData);
  }

  async function saveBlockData(blockData) {
    await blockRepo.add(blockData);

    return true;
  }

  async function saveBlockDataMany(blockData) {
    const sTime = Date.now();
    await blockRepo.addMany(blockData);
    const eTime = Date.now();

    return _calculateSaveTimeInSeconds(sTime, eTime);
  }

  async function getAllBlockHeights(chainId) {
    const heightResult = await blockRepo.get({
      query: { chainId },
      projection: {
        _id: 0,
        height: 1,
      },
      sort: { height: -1 },
    });
    return heightResult.map((block) => {
      return block.height;
    });
  }

  async function getHighestBlock(service) {
    const { blocks } = await blockRepo.get({
      query: { chainId: service.chainId },
      sort: { height: -1 },
      limit: 1,
    });
    let block = blocks[0];
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
    saveBlockDataMany,
    saveBlockDataWithHash,
    getHighestBlock,
    getAllBlockHeights,
  };
}

module.exports = TransactionHandler;
