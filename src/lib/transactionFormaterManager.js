function TransactionFormaterManager() {
  const formaterArray = [];

  return {
    setFormater(formater) {
      formaterArray.push(formater);
    },
    getFormater(chainId) {
      return formaterArray.find((entry) => entry.chainId == chainId);
    },
  };
}

module.exports = TransactionFormaterManager;
