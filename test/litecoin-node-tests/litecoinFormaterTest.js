const { assert } = require("chai");
const { MongoClient } = require("mongodb");
const LitecoinTransactionFormater = require("../../src/lib/formater/litecoinTransactionFormater");
const TransactionRepository = require("../../src/lib/repos/transactionRepository");
const transactions = require("../mocks/transactionsMock.json");
const dbTransactions = require("../mocks/litecoinTransactionDBMock.json");

function getDbConfig() {
  return {
    host: "127.0.0.1",
    port: "",
    dbName: "litecoinFormater_test",
  };
}

describe("LitecoinTransactionFormater formatForDB", () => {
  it("should return a formated transaction obj", () => {
    let transaction = transactions[0];
    const formater = LitecoinTransactionFormater();
    transaction = formater.formatForDB(transaction);
    console.log(transaction);
    assert.strictEqual(Object.keys(transaction).length, 4);
  });
});

describe("LitecoinTransactionFormater foramtAccountStructure", () => {
  it("should return a transaction in account structure", async () => {
    const repository = TransactionRepository(getDbConfig());
    await repository.connect();
    await repository.addMany(dbTransactions);
    const formater = LitecoinTransactionFormater();
    transaction = await formater.formatAccountStructure(
      dbTransactions[0],
      repository
    );
    assert.strictEqual(transaction.from instanceof Array, true);
    assert.strictEqual(transaction.to instanceof Array, true);
  });
});

after(async () => {
  const { host, dbName, port } = getDbConfig();
  const url = `mongodb://${host}:${port}`;
  const client = new MongoClient(url);
  await client.connect();
  await client.db(dbName).dropDatabase();
  client.close();
});
