function TransactionFormaterManager() {
  const formaterArray = [];

  return {
    setFormater(formater) {
      formaterArray.push(formater);
    },
    getFormater(chainname) {
      return formaterArray.find((entry) => entry.chainname == chainname);
    },
  };
}

module.exports = TransactionFormaterManager;
