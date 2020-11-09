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

  return { connect, createIndex, add, get };
}

module.exports = BlockRepository;
