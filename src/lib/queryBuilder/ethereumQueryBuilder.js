function EthereumQueryBuilder(formater) {
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

  Object.defineProperty(queryBuilder, formater, {
    value: formater,
    writable: true,
    enumerable: true,
    configurable: true,
  });

  return queryBuilder;
}

module.exports = EthereumQueryBuilder;
