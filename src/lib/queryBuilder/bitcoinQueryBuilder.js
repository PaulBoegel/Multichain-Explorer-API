function BitcoinQueryBuilder(formater, repo, chainId) {
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

  async function _getBlockRelations({ transactions, blockHeights, searchVIN }) {
    let inputs = new Set();
    let outputs = [];
    let blocks = [];
    let vin = [];

    if (searchVIN) {
      transactions.forEach((transaction) => {
        if (transaction.txid) outputs.push(transaction.txid);
        vin.push(...transaction.vin);
      });

      vin.forEach((input) => {
        if (input.txid) inputs.add(input.txid);
      });
    }

    blocks.push(
      ...(await _searchForBlockRelations.call(
        this,
        outputs,
        Array.from(inputs),
        blockHeights
      ))
    );
    return blocks;
  }

  function _fillTransactionPool({ blocks }) {
    const transactionPool = [];
    blocks.forEach((block) => transactionPool.push(...block.tx));
    return transactionPool;
  }

  function _formatTransactionWithPoolData({ transactionPool }) {
    this.formater.formatAccountStructure({ transactionPool });
  }

  function _formatBlocks(blocks) {
    return blocks.map((block) => {
      const { time, previousblockhash, ...data } = block;
      return {
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
    }) {
      const query = { chainId: this.chainId, height, hash };
      await this.repo.connect();
      let blocks = await this.repo.get({ query, projection });
      const blockHeights = blocks.map((block) => {
        return block.height;
      });
      let transactionPool = _fillTransactionPool.call(this, { blocks });
      blocks.push(
        ...(await _getBlockRelations.call(this, {
          transactions: transactionPool,
          blockHeights,
          searchVIN: false,
        }))
      );

      blocks.forEach((block) => transactionPool.push(...block.tx));

      transactionPool = _fillTransactionPool.call(this, { blocks });

      _formatTransactionWithPoolData.call(this, { transactionPool });

      blocks = _formatBlocks(blocks);
      return blocks;
    },
    async transactionSearch({ txid, projection = {} }) {
      const query = { chainId: this.chainId, "tx.txid": txid };
      await this.repo.connect();
      let blocks = await this.repo.get({ query, projection });
      if (blocks.length === 0) return;
      const blockHeights = blocks.map((block) => {
        return block.height;
      });

      let transactionPool = _fillTransactionPool.call(this, { blocks });
      const transactions = [
        transactionPool.find((transaction) => transaction.txid === txid),
      ];
      blocks.push(
        ...(await _getBlockRelations.call(this, {
          transactions,
          blockHeights,
          searchVIN: true,
        }))
      );

      transactionPool = _fillTransactionPool.call(this, { blocks });
      _formatTransactionWithPoolData.call(this, { transactionPool });

      blocks = _formatBlocks(blocks);
      return blocks;
    },
    async addressSearchQuery({ address, projection }) {
      const query = { chainId: this.chainId, "tx.vout.addresses": address };
      const transactions = [];
      let transactionPool = [];
      await this.repo.connect();
      let blocks = await this.repo.get({ query, projection });

      blocks.forEach((block) => transactionPool.push(...block.tx));

      const outputs = [];
      transactionPool.forEach((transaction) => {
        outputs.push(
          ...transaction.vout.map((output) => {
            return {
              address: output.addresses,
              txid: transaction.txid,
              vin: transaction.vin,
            };
          })
        );
      });

      outputs.forEach((output) => {
        if (!output.address) return;
        if (output.address.includes(address)) transactions.push(output);
      });

      const blockHeights = blocks.map((block) => {
        return block.height;
      });
      blocks.push(
        ...(await _getBlockRelations.call(this, {
          transactions,
          blockHeights,
          searchVIN: true,
        }))
      );

      transactionPool = _fillTransactionPool.call(this, { blocks });

      _formatTransactionWithPoolData.call(this, { transactionPool });

      blocks = _formatBlocks(blocks);
      return blocks;
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
