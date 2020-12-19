function Resolvers({ queryBuilderManager }) {
  return {
    RootQuery: {
      async blocks(root, { height, hash, chainId, pageSize, page }, context) {
        const queryBuilder = queryBuilderManager.getQueryBuilder(chainId);
        const result = await queryBuilder.blockSearch({
          height,
          hash,
          pageSize,
          page,
        });
        return result;
      },
      async transactions(root, { txid, chainId, pageSize, page }, context) {
        const queryBuilder = queryBuilderManager.getQueryBuilder(chainId);
        const result = await queryBuilder.transactionSearch({
          txid,
          pageSize,
          page,
        });
        return result;
      },
      async address(root, { address, chainId, pageSize, page }, context) {
        const queryBuilder = queryBuilderManager.getQueryBuilder(chainId);
        const result = await queryBuilder.addressSearchQuery({
          address,
          pageSize,
          page,
        });
        return result;
      },
      async searchEntity(root, { chainId, searchString }, context) {
        const queryBuilder = queryBuilderManager.getQueryBuilder(chainId);
        const id = await queryBuilder.searchEntityId({ searchString });
        return id;
      },
      async getHeight(root, { chainId }, context) {
        const queryBuilder = queryBuilderManager.getQueryBuilder(chainId);
        const height = await queryBuilder.getHeight();
        return height;
      },
    },
  };
}

module.exports = Resolvers;
