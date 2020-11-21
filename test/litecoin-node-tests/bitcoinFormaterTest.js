const { assert } = require("chai");
BitcoinTransactionFormater = require("../../src/lib/formater/bitcoinTransactionFormater");
const transactions = require("../mocks/transactionsMock.json");

describe("BitcoinTransactionFormater formatForDB", () => {
  it.only("should return a formated transaction obj", () => {
    let transaction = transactions[0];
    const formater = BitcoinTransactionFormater();
    transaction = formater.formatForDB(transaction);
    console.log(transaction);
    assert.strictEqual(Object.keys(transaction).length, 4);
  });
});
