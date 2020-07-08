const assert = require('assert');
const { MongoClient } = require('mongodb');
const TransactionRepository = require('../../server/repos/transactionRepository');
const ConfigurationHandler = require('../../server/handler/configurationHandler');

const configurationHandler = new ConfigurationHandler()
const config = configurationHandler.readAndParseJsonFile('./explorer-config.json');

async function main(){
  const url = `mongodb://${config.dbConfig.test.host}:${config.dbConfig.test.port}`;
  const client = new MongoClient(url);
  const dbName = config.dbConfig.test.dbName;
  const transRepo = new TransactionRepository(config.dbConfig.test);
  const data = configurationHandler.readAndParseJsonFile('./tests/repos/transactions.json');

  const singleTransaction = {
    "txid": "123456789",
    "hash": "6744318e7359b3c5cf819312230f323b3a3c5483f5d8293a1542801d16a4fa7c",
    "version": 2,
    "size": 249,
    "vsize": 168,
    "weight": 669,
    "locktime": 0,
    "vin": [
      {
        "txid": "371d57873c50fb720dc67bf456cfea0e500b410ff374a226f423a10c1a8985fb",
        "vout": 1,
        "scriptSig": {
          "asm": "0014f27b256bd7632d898714049e52329ae483f976a6",
          "hex": "160014f27b256bd7632d898714049e52329ae483f976a6"
        },
        "txinwitness": [
          "30440220185fb59b0252ac8204f014008742f256c9bced4f05d82932fbd8c8ba0741753402205f51da1387a683a3cf1ff5cca037e9bdf2d21dd1182369a752d78ca42832680c01",
          "03b86e901e0f5a40cb45d524f1b745ae22a8607d8d08467945fcef3de11cd5247f"
        ],
        "sequence": 4294967295
      }
    ],
    "vout": [
      {
        "value": 0.00131465,
        "n": 0,
        "scriptPubKey": {
          "asm": "OP_DUP OP_HASH160 a421dae5ab2e3637c005e8c2c5828ea702efe6b4 OP_EQUALVERIFY OP_CHECKSIG",
          "hex": "76a914a421dae5ab2e3637c005e8c2c5828ea702efe6b488ac",
          "reqSigs": 1,
          "type": "pubkeyhash",
          "addresses": [
            "LaBodxtora6UDsr52LkyfPdXs6F8V9oWVm"
          ]
        }
      },
      {
        "value": 0.27674086,
        "n": 1,
        "scriptPubKey": {
          "asm": "OP_HASH160 df72bf3c060b504b6a82094206f773adad5a7b25 OP_EQUAL",
          "hex": "a914df72bf3c060b504b6a82094206f773adad5a7b2587",
          "reqSigs": 1,
          "type": "scripthash",
          "addresses": [
            "MUGeNyEb6coibqco6KwmQR7PqRHDhGodCZ"
          ]
        }
      }
    ]
  }

  try {
    //Load data
    const results = await transRepo.loadData(data);
    assert.equal(data.length, results.insertedCount);
    console.log(results.ops);

    //all get
    const getData = await transRepo.get();
    assert.equal(data.length, getData.length);

    //filter get
     const filterData = await transRepo.get({txid: getData[2].txid});
     assert.equal(filterData[0].txid, getData[2].txid);

     //limit get
     const limitData = await transRepo.get({}, 2);
     assert.equal(limitData.length, 2);

    //get by txid
    const byId = await transRepo.getById(getData[2].txid);
    assert.deepEqual(byId.txid, getData[2].txid);

    //transaction not exist
    const noResult = await transRepo.getById("1234567");
    assert.deepEqual(noResult, null);

    //item add
    const addedItem = await transRepo.add(singleTransaction);
    assert(addedItem.txid, "123456789");

  } catch(err){
    console.log(err);
  } finally {
    await client.connect();
    client.db(dbName);

    const admin = client.db(dbName).admin();

    console.log(await admin.listDatabases());

    await client.db(dbName).dropDatabase();
    client.close();
  }
};

main();
