function BitcoinQueryBuilder(formater, repo, chainId) {
  function _getInputArrayQuery(txids) {
    return [
      { $match: { chainId: this.chainId, "tx.txid": { $in: txids } } },
      { $unwind: "$tx" },
      { $match: { "tx.txid": { $in: txids } } },
      { $project: { _id: 0 } },
    ];
  }

  function _getOutputArrayQuery(txids) {
    return [
      {
        $match: {
          chainId: this.chainId,
          "tx.vin.txid": { $in: txids },
        },
      },
      { $unwind: "$tx" },
      { $match: { "tx.vin.txid": { $in: txids } } },
      { $project: { _id: 0 } },
    ];
  }

  function _getTransactionQuery(txid) {
    return [
      { $match: { chainId: this.chainId, "tx.txid": txid } },
      { $unwind: "$tx" },
      { $match: { "tx.txid": txid } },
      { $project: { _id: 0 } },
    ];
  }
  function _getAddressQuery(address) {
    return [
      { $match: { chainId: this.chainId, "tx.vout.addresses": address } },
      { $unwind: "$tx" },
      { $match: { "tx.vout.addresses": address } },
    ];
  }

  async function _searchForBlockRelations(outputs, inputs, blockHeights) {
    return await this.repo.get({
      query: {
        $or: [
          {
            height: { $nin: blockHeights },
            chainId: this.chainId,
            "tx.vin.txid": { $in: outputs },
          },
          {
            height: { $nin: blockHeights },
            chainId: this.chainId,
            "tx.txid": { $in: inputs },
          },
        ],
      },
    });
  }

  function _formatTransactionWithPoolData({
    transactions,
    txRelationPool,
    out,
  }) {
    this.formater.formatAccountStructure({ transactions, txRelationPool, out });
  }

  function _formatBlocks(blocks) {
    return blocks.map((block) => {
      const { time, previousblockhash, tx, ...data } = block;
      return {
        tx: tx instanceof Array ? tx : [tx],
        mined: new Date(time).toDateString(),
        parent: previousblockhash,
        ...data,
      };
    });
  }

  const queryBuilder = {
    async blockSearch({
      height = { $exists: true },
      hash = { $exists: true },
      projection = {},
      page = 0,
      pageSize = 0,
    }) {
      let limit = pageSize;
      const skip = pageSize * page;
      let query = { chainId: this.chainId, height, hash };
      await this.repo.connect();
      let { blocks, count } = await this.repo.get({
        query,
        projection,
        limit,
        skip,
        countOn: true,
      });
      let currentCount = blocks.length;
      let [block] = blocks;
      const relationBlocks = [];
      const transactions = [];
      const inputIds = [];
      block.tx.forEach((transaction) => {
        inputIds.push(...transaction.vin.map((input) => input.txid));
        transactions.push(...block.tx);
      });
      query = _getInputArrayQuery.call(this, inputIds);

      relationBlocks.push(...(await this.repo.aggregate({ pipeline: query })));

      txRelationPool = relationBlocks.map((block) => block.tx);
      _formatTransactionWithPoolData.call(this, {
        transactions,
        txRelationPool,
      });

      block = _formatBlocks([block]);
      return { size: 0, blocks: block };
    },
    async transactionSearch({ txid, projection = {} }) {
      let size = 0;
      let query = _getTransactionQuery.call(this, txid);
      const relationBlocks = [];
      await this.repo.connect();
      let [block] = await this.repo.aggregate({ pipeline: query });
      if (block.length === 0) return [];

      let inputIds = block.tx.vin.map((input) => input.txid);
      query = _getInputArrayQuery.call(this, inputIds);
      relationBlocks.push(...(await this.repo.aggregate({ pipeline: query })));

      const txRelationPool = relationBlocks.map((block) => block.tx);

      _formatTransactionWithPoolData.call(this, {
        transactions: [block.tx],
        txRelationPool,
      });

      let blocks = _formatBlocks([block]);
      return { size, blocks };
    },
    async addressSearchQuery({ address, projection }) {
      let size = 0;
      let query = _getAddressQuery.call(this, address);
      const transactions = [];
      const outputIds = [];
      await this.repo.connect();
      let blocks = await this.repo.aggregate({ pipeline: query });
      blocks.forEach((block) => {
        outputIds.push(block.tx.txid);
      });

      query = _getOutputArrayQuery.call(this, outputIds);

      blocks.push(...(await this.repo.aggregate({ pipeline: query })));

      blocks.forEach((block) => {
        transactions.push(block.tx);
      });
      _formatTransactionWithPoolData.call(this, {
        transactions,
        out: true,
      });

      blocks = _formatBlocks(blocks);

      blocksSeen = new Set();
      blocks = blocks.filter((block) => {
        const dupblicated = blocksSeen.has(block.tx[0].txid);
        blocksSeen.add(block.tx.txid);
        return !dupblicated;
      });

      return { size, blocks };
    },

    async searchEntityId({ searchString }) {
      if (!isNaN(searchString) && !isNaN(parseInt(searchString))) {
        return 0;
      }
      if (searchString.length === 64) {
        return 1;
      }
      return 2;
    },

    async getHeight() {
      await this.repo.connect();
      let { blocks, count } = await this.repo.get({
        query: { chainId: this.chainId },
        sort: { height: -1 },
        limit: 1,
      });
      return blocks[0].height;
    },
  };

  Object.defineProperty(queryBuilder, "chainId", {
    value: chainId,
    writable: true,
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(queryBuilder, "formater", {
    value: formater,
    writable: true,
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(queryBuilder, "repo", {
    value: repo,
    writable: false,
    enumerable: true,
    configurable: true,
  });

  return queryBuilder;
}

module.exports = BitcoinQueryBuilder;
