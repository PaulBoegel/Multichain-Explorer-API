function BitcoinQueryBuilder(formater, repo) {
  const queryBuilder = {
    async addressSearchQuery(address) {
      try {
        const addressQuery = { "vout.addresses": address };
        const projection = { _id: 0 };
        const transactions = [];
        let transactionPromises = [];
        let result = [];

        await this.repo.connect();

        for (let transaction of await this.repo.get(addressQuery, projection)) {
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
