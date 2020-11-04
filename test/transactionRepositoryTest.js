const assert = require("assert");
const { MongoClient } = require("mongodb");
const TransactionRepository = require("../src/lib/repos/transactionRepository");
const transactions = require("./mocks/transactionsMock.json");
function getDbConfig() {
  return {
    host: "127.0.0.1",
    port: "",
    dbName: "transactionRepository_test",
  };
}

describe("TransactionRepository connect", () => {
  const dbconfig = getDbConfig();
  const repo = new TransactionRepository(dbconfig);
  it("should return a true if connection is established", async () => {
    const connection = await repo.connect();
    assert.strictEqual(connection, true);
  });
});

describe("TransactionRepository AddMany", () => {
  const dbconfig = getDbConfig();
  const repo = new TransactionRepository(dbconfig);
  it("result should be one", async () => {
    await repo.connect();
    const data = await repo.addMany([{ txid: "1234" }]);
    assert.strictEqual(data, 1);
  });
  it("should save an array of two transactions", async () => {
    const data = await repo.addMany(transactions);
    assert.strictEqual(data, 2);
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
