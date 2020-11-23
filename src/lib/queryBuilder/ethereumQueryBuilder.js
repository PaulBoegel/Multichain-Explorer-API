function EthereumQueryBuilder(formater, repo) {
  const queryBuilder = {
    async addressSearchQuery(address) {
      const toQuery = { to: address };
      const fromQuery = { from: address };
      const projection = { _id: 0 };
      let promises = [];
      const transactions = [];

      await this.repo.connect();

      promises.push(this.repo.get(toQuery, projection));
      promises.push(this.repo.get(fromQuery, projection));

      let result = await Promise.all(promises);
      result.forEach((item) => {
        if (item instanceof Array) {
          transactions.push(...item);
          return;
        }
        transactions.push(item);
      });

      promises.length = 0;
      result.length = 0;
      for (let transaction of transactions) {
        promises.push(this.formater.formatAccountStructure(transaction));
      }

      result = await Promise.all(promises);
      result.forEach((item) => {
        if (item instanceof Array) {
          transactions.push(...item);
          return;
        }
        transactions.push(item);
      });

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
