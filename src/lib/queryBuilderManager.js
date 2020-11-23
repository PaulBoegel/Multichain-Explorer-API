function QueryBuilderManager() {
  const queryBuilderArray = [];

  return {
    setQueryBuilder(queryBuilder) {
      queryBuilderArray.push(queryBuilder);
    },
    getQueryBuilder(chainname) {
      return queryBuilderArray.find((entry) => entry.chainname == chainname);
    },
  };
}

module.exports = QueryBuilderManager;
