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
    db.collection("blocks").createIndex("hash");
    db.collection("blocks").createIndex("height");
    db.collection("blocks").createIndex("chainname");
    db.collection("blocks").createIndex("tx.txid");
    db.collection("blocks").createIndex("tx.vin.txid");
    db.collection("blocks").createIndex("tx.vout.addresses");
    db.collection("blocks").createIndex("tx.from");
    db.collection("blocks").createIndex("tx.to");
  }

  function _checkConnection() {
    if (Object.keys(db).length === 0)
      throw new Error("no database connection established");
  }

  async function get({ query = {}, projection = {}, sort = {}, limit = 0 }) {
    try {
      _checkConnection();
      let blocks = await db
        .collection("blocks")
        .find(query, projection)
        .sort(sort);
      if (limit > 0) {
        blocks = blocks.limit(limit);
      }

      blocks = await blocks.toArray();
      return blocks;
    } catch (err) {
      throw err;
    }
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

  return { connect, createIndex, add, addMany, get };
}

module.exports = BlockRepository;
