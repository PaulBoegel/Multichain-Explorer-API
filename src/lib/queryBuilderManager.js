function QueryBuilderManager() {
  const queryBuilderArray = [];

  return {
    setQueryBuilder(queryBuilder) {
      queryBuilderArray.push(queryBuilder);
    },
    getQueryBuilder(chainId) {
      return queryBuilderArray.find((entry) => entry.chainId == chainId);
    },
  };
}

module.exports = QueryBuilderManager;
