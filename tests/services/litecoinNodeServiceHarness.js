const LitecoinNodeService = require('../../server/services/litecoinNodeService');
const ConfigurationHandler = require('../../server/handler/configurationHandler');
const RpcClient = require('bitcoind-rpc');
const assert = require('assert');

const configurationHandler = new ConfigurationHandler()
const config = configurationHandler.readAndParseJsonFile('./explorer-config.json');
const rpc = new RpcClient(config.blockchainConfig.litecoin.rpc);
const litecoinNodeService = new LitecoinNodeService(rpc);

const pureTransaction = {
  vin: [
    {
      "txid": "371d57873c50fb720dc67bf456cfea0e500b410ff374a226f423a10c1a8985fb"
    },
    {
      "txid": "2dfdbaf56adb7586de245ae1924654d3b91f771eb4f7f7170dfe50620090a2ef"
    }
  ]
}

const coinbaseTransaction = {
  vin: [
    { "coinbase": "123123123" }
  ]
}

async function main(){
  try {

    //check transaction with 2 relations
    const relations = await litecoinNodeService.getRelations(pureTransaction);
    assert.equal(relations.length, 2);

    //check transaction as coinbase
    const coinbaseRelations = await litecoinNodeService.getRelations(coinbaseTransaction);
    assert.equal(coinbaseRelations, null);

  } catch(err){
    console.log(err);
  }
}

main();

