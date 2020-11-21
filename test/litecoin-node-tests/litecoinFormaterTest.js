const { assert } = require("chai");
LitecoinTransactionFormater = require("../../src/lib/formater/litecoinTransactionFormater");
const transactions = require("../mocks/transactionsMock.json");

describe("LitecoinTransactionFormater formatForDB", () => {
  it.only("should return a formated transaction obj", () => {
    let transaction = transactions[0];
    const formater = LitecoinTransactionFormater();
    transaction = formater.formatForDB(transaction);
    console.log(transaction);
    assert.strictEqual(Object.keys(transaction).length, 4);
  });
});
