"use strict";

function DataHandler(blockRepo) {
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
    await blockRepo.addMany(blockData);
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

module.exports = DataHandler;
