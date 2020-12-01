function EthereumQueryBuilder(formater, repo) {
  const queryBuilder = {
    async addressSearchQuery(
      from = { $exists: true },
      to = { $exists: true },
      limit = 0
    ) {
      const projection = { _id: 0 };
      let promises = [];
      const transactions = [];

      await this.repo.connect();

      promises.push(this.repo.get({ from, to }, projection, limit));

      let results = await Promise.all(promises);
      for (result of results) {
        if (result instanceof Array) {
          transactions.push(...result);
          continue;
        }
        transaction.push(result);
      }

      for (let transaction of transactions) {
        this.formater.formatAccountStructure(transaction);
      }

      return transactions;
    },
  };

  Object.defineProperty(queryBuilder, "chainname", {
    value: "ethereum",
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
