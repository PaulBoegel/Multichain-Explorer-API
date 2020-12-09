function BitcoinQueryBuilder(formater, repo, chainId) {
  const queryBuilder = {
    async blockSearch({ height, projection = {} }) {
      const query = { chainId: this.chainId, height };
      await this.repo.connect();
      const blocks = await this.repo.get({ query, projection });
      const transactions = [];
      let inputs = [];
      let outputs = [];

      blocks.forEach((block) => {
        transactions.push(...block.tx);
      });

      transactions.forEach((transaction) => {
        inputs.push(...transaction.vin);
        outputs.push(transaction.txid);
      });

      blocks.push(
        ...(await this.repo.get({
          $and: {
            chainId: this.chainId,
            "tx.vin.txid": { $in: outputs },
          },
        }))
      );

      return blocks;
    },
    async addressSearchQuery(from, to = undefined, limit = 0) {
      try {
        const fromQuery = { "vout.addresses": from };
        const projection = { _id: 0 };
        const transactions = [];
        let transactionPromises = [];
        let result = [];

        await this.repo.connect();

        for (let transaction of await this.repo.get(fromQuery, projection)) {
          transactions.push(transaction);
          const outputQuery = { "vin.txid": transaction.txid };
          transactionPromises.push(this.repo.get(outputQuery, projection));
        }

        result = await Promise.all(transactionPromises);
        result.forEach((item) => {
          if (item instanceof Array) {
            transactions.push(...item);
            return;
          }
          transactions.push(item);
        });

        transactionPromises.length = 0;
        for (let transaction of transactions) {
          transactionPromises.push(
            this.formater.formatAccountStructure(transaction, this.repo)
          );
        }

        result.length = 0;
        result = await Promise.all(transactionPromises);
        result.forEach((item) => {
          if (item instanceof Array) {
            transactions.push(...item);
            return;
          }
          transactions.push(item);
        });

        if (limit > 0) transactions.length = limit - 1;
        return transactions;
      } catch (err) {
        console.log(err);
      }
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
