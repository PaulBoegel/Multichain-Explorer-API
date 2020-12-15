function Resolvers({ queryBuilderManager }) {
  return {
    RootQuery: {
      async blocks(root, { height, hash, chainId }, context) {
        const queryBuilder = queryBuilderManager.getQueryBuilder(chainId);
        const result = await queryBuilder.blockSearch({ height, hash });
        return result;
      },
      async transactions(root, { txid, chainId }, context) {
        const queryBuilder = queryBuilderManager.getQueryBuilder(chainId);
        const result = await queryBuilder.transactionSearch({
          txid,
        });
        return result;
      },
      async address(root, { address, chainId }, context) {
        const queryBuilder = queryBuilderManager.getQueryBuilder(chainId);
        const result = await queryBuilder.addressSearchQuery({
          address,
        });
        return result;
      },
    },
  };
}

module.exports = Resolvers;
