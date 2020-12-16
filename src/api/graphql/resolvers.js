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
      async searchEntity(root, { searchString, chainId }, context) {
        const queryBuilder = queryBuilderManager.getQueryBuilder(chainId);
        const id = await queryBuilder.searchEntityId({ searchString });
        return id;
      },
    },
  };
}

module.exports = Resolvers;
