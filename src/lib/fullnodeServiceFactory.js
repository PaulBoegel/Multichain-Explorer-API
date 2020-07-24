"user-strict"

const LitecoinNodeService = require('./services/litecoinNodeService');
const { RPCClient } = require("rpc-bitcoin");

function FullnodeServiceFactory(config){

  function createService(blockchainName){
    switch(blockchainName){
      case config.litecoin.chainname:
        return createLitecoinService();
        break;
    }
  }

  function createLitecoinService(){
    const conf = config.litecoin.rpc;
    const litecoinRpc = new RPCClient({url: conf.url, user: conf.user, pass: conf.pass, port: conf.port});
    return new LitecoinNodeService(litecoinRpc, config.litecoin.chainname);
  }

  return { createService }
}

module.exports = FullnodeServiceFactory;
