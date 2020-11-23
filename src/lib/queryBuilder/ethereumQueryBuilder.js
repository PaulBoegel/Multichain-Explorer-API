function EthereumQueryBuilder() {
  const queryBuilder = {
    addressSearchQuery(address) {
      return {
        //"vout.address": address,
      };
    },
  };

  Object.defineProperty(queryBuilder, "chainname", {
    value: "ethereum",
    writable: true,
    enumerable: true,
    configurable: true,
  });

  return queryBuilder;
}

module.exports = EthereumQueryBuilder;
