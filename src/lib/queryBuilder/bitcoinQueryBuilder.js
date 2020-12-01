function BitcoinQueryBuilder(formater, repo) {
  const queryBuilder = {
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
