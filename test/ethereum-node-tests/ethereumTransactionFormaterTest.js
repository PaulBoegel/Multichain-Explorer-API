const { assert } = require("chai");
EthereumTransactionFormater = require("../../src/lib/formater/ethereumTransactionFormater");
const transactions = require("../mocks/ethereumTransactionsMock.json");

describe("EthereumTransactionFormater formatForDB", () => {
  it("should return a formated transaction obj", () => {
    let transaction = transactions[0];
    const formater = EthereumTransactionFormater();
    transaction = formater.formatForDB(transaction);
    assert.strictEqual(Object.keys(transaction).length, 7);
  });
});
