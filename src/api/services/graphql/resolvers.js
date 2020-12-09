function Resolvers({ queryBuilderManager }) {
  return {
    RootQuery: {
      async blocks(root, { height, chainId }, context) {
        const queryBuilder = queryBuilderManager.getQueryBuilder(chainId);
        const result = await queryBuilder.blockSearch({ height });
        return result;
      },
    },
  };
}

module.exports = Resolvers;
