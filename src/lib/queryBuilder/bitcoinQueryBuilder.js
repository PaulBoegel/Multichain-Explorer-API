function BitcoinQueryBuilder(formater, repo) {
  const queryBuilder = {
    async addressSearchQuery(address) {
      const addressQuery = { "vout.addresses": address };
      const projection = { _id: 0 };
      const transactions = [];

      await this.repo.connect();

      for (let transaction of await this.repo.get(addressQuery, projection)) {
        transactions.push(transaction);
        const outputQuery = { "vin.txid": transaction.txid };
        transactions.push(...(await this.repo.get(outputQuery, projection)));
      }

      for (let transaction of transactions) {
        await this.formater.formatAccountStructure(transaction, this.repo);
      }

      return transactions;
    },
  };

  Object.defineProperty(queryBuilder, "chainname", {
    value: "bitcoin",
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
