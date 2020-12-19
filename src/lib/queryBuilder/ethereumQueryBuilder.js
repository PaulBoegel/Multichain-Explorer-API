function EthereumQueryBuilder(formater, repo, chainId) {
  function _formatTransactionWithPoolData({ transactionPool }) {
    transactionPool.forEach((transaction) => {
      this.formater.formatAccountStructure({ transaction });
    });
  }

  function _fillTransactionPool({ blocks }) {
    const transactionPool = [];
    blocks.forEach((block) => transactionPool.push(...block.tx));
    return transactionPool;
  }

  function _formatBlocks(blocks) {
    return blocks.map((block) => {
      const { time, parentHash, ...data } = block;
      return {
        parent: parentHash,
        ...data,
      };
    });
  }

  function _prepareBlocks(blocks) {
    let transactionPool = _fillTransactionPool.call(this, { blocks });
    _formatTransactionWithPoolData.call(this, { transactionPool });

    blocks = _formatBlocks(blocks);
    return blocks;
  }

  const queryBuilder = {
    async blockSearch({
      height = { $exists: true },
      hash = { $exists: true },
      projection = {},
    }) {
      const query = { chainId: this.chainId, height, hash };
      await this.repo.connect();
      let blocks = await this.repo.get({
        query,
        projection,
      });
      return _prepareBlocks.call(this, blocks);
    },
    async transactionSearch({ txid, projection = {}, pageSize, page }) {
      const limit = pageSize;
      const skip = pageSize * page;
      const query = { chainId: this.chainId, "tx.txid": txid };
      await this.repo.connect();
      let blocks = await this.repo.get({ query, projection, limit, skip });
      return _prepareBlocks.call(this, blocks);
    },

    async addressSearchQuery({ address, projection, pageSize, page }) {
      const limit = pageSize;
      const skip = pageSize * page;
      const query = {
        $or: [
          { chainId: this.chainId, "tx.from": address },
          { chainId: this.chainId, "tx.to": address },
        ],
      };
      await this.repo.connect();
      let blocks = await this.repo.get({ query, projection, limit, skip });
      return _prepareBlocks.call(this, blocks);
    },

    async searchEntityId({ searchString }) {
      if (searchString.slice(0, 2) === "0x" && searchString.length === 66) {
        return 1;
      }
      if (searchString.slice(0, 2) === "0x") {
        return 2;
      }
      if (!isNaN(searchString) && !isNaN(parseInt(searchString))) {
        return 0;
      }
    },

    async getHeight() {
      await this.repo.connect();
      let [block] = await this.repo.get({
        query: { chainId: this.chainId },
        sort: { height: -1 },
        limit: 1,
      });
      return block.height;
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

module.exports = EthereumQueryBuilder;
