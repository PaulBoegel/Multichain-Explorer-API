function BitcoinQueryBuilder() {
  const queryBuilder = {
    addressSearchQuery(address) {
      return {
        "vout.address": address,
      };
    },
  };

  Object.defineProperty(queryBuilder, "chainname", {
    value: "bitcoin",
    writable: true,
    enumerable: true,
    configurable: true,
  });

  return queryBuilder;
}

module.exports = BitcoinQueryBuilder;
