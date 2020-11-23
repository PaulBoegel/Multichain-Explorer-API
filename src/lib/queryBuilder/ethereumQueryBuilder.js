function EthereumQueryBuilder(formater, repo) {
  const queryBuilder = {
    async addressSearchQuery(address) {
      const toQuery = { to: address };
      const fromQuery = { from: address };
      const projection = { _id: 0 };
      const transactions = [];

      await this.repo.connect();

      transactions.push(...(await this.repo.get(toQuery, projection)));
      transactions.push(...(await this.repo.get(fromQuery, projection)));

      for (let transaction of transactions) {
        await this.formater.formatAccountStructure(transaction);
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
