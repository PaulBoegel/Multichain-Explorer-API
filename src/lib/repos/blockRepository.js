const { MongoClient } = require("mongodb");
function BlockRepository({ host, port, dbName, poolSize = 10 }) {
  const url = `mongodb://${host}:${port}`;
  let db = {};

  function connect() {
    return new Promise((resolve, reject) => {
      MongoClient.connect(
        url,
        {
          useUnifiedTopology: true,
          poolSize,
        },
        function (err, client) {
          if (err) reject(err);
          db = client.db(dbName);
          resolve(true);
        }
      );
    });
  }

  function createIndex() {
    _checkConnection();
    db.collection("blocks").createIndex({ chainId: 1 });
    db.collection("blocks").createIndex({ height: 1 });
    db.collection("blocks").createIndex({ "tx.txid": 1 });
    db.collection("blocks").createIndex({ "tx.vin.txid": 1 });
    db.collection("blocks").createIndex({ chainId: 1, "tx.from": 1 });
    db.collection("blocks").createIndex({ chainId: 1, "tx.to": 1 });
  }

  function _checkConnection() {
    if (Object.keys(db).length === 0)
      throw new Error("no database connection established");
  }

  async function get({
    query = {},
    projection = {},
    sort = {},
    limit = 0,
    skip = 0,
    countOn = false,
  }) {
    _checkConnection();
    let blocks = await db
      .collection("blocks")
      .find(query, { projection })
      .sort(sort);

    let count = 0;
    if (countOn) count = await blocks.count();

    if (limit > 0) {
      blocks = blocks.limit(limit);
    }

    if (skip > 0) {
      blocks = blocks.skip(skip);
    }

    blocks = await blocks.toArray();
    return { blocks, count };
  }

  async function add(newBlock) {
    _checkConnection();
    const { height, hash, ...data } = newBlock;
    const keys = { height, hash };
    data.timestamp = Date.now();
    await db
      .collection("blocks")
      .updateOne(keys, { $set: { ...data } }, { upsert: true });
    return true;
  }

  async function addMany(newBlocks) {
    _checkConnection();
    const result = await db
      .collection("blocks")
      .insertMany(newBlocks, { ordered: false });
    return result.insertedCount;
  }

  async function aggregate({ pipeline }) {
    _checkConnection();
    let result = await db.collection("blocks").aggregate(pipeline);

    result = await result.toArray();
    return result;
  }

  return { connect, createIndex, add, addMany, get, aggregate };
}

module.exports = BlockRepository;
