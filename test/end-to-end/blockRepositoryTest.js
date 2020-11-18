const assert = require("assert");
const { MongoClient } = require("mongodb");
const BlockRepository = require("../../src/lib/repos/blockRepository");

function getDbConfig() {
  return {
    host: "127.0.0.1",
    port: "",
    dbName: "blockRepository_test",
  };
}

describe("BlockRepository connect", () => {
  const dbconfig = getDbConfig();
  const repo = new BlockRepository(dbconfig);
  it("should return a true if connection is established", async () => {
    const connection = await repo.connect();
    assert.strictEqual(connection, true);
  });
});

describe("BlockRepository get", () => {
  const dbconfig = getDbConfig();
  const repo = new BlockRepository(dbconfig);
  it("should return an empty array", async () => {
    await repo.connect();
    const data = await repo.get({
      query: {},
      projection: { height: 1 },
      limit: 1,
      sort: { height: -1 },
    });
    assert.strictEqual(data.length, 0);
  });
  it("should return the highest block", async () => {
    await repo.connect();
    await repo.add({ hash: 0, height: 0 });
    await repo.add({ hash: 1, height: 1 });
    const data = await repo.get({
      query: {},
      projection: { height: 1 },
      limit: 1,
      sort: { height: -1 },
    });
    assert.strictEqual(data[0].height, 1);
  });
});

describe("BlockRepository Add", () => {
  const dbconfig = getDbConfig();
  const repo = new BlockRepository(dbconfig);
  it("result should be true", async () => {
    await repo.connect();
    const data = await repo.add({ hash: 1234, height: 1 });
    assert.strictEqual(data, true);
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
