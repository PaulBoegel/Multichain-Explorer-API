"use strict";

const LitecoinNotifyer = require('./notifyer/litecoinNotifyer');
const LitecoinNodeService = require('./services/litecoinNodeService');
const RpcClient = require('bitcoind-rpc');
const zmq = require('zeromq');

function FullnodeApiFactory(config){

  if(typeof config === undefined || config == null)
    throw new ReferenceError('Config is not defined.');

  const apiArray = [];

  function createApi(blockchainName){
    if(typeof blockchainName === undefined || blockchainName == null)
      throw new ReferenceError('No blockchain name defined.');

    switch(blockchainName){
      case "litecoin":
        return createLitecoinAPI();
        break;
    }
  }

  function getApiArray(){
    return apiArray;
  }

  function createLitecoinAPI(){
    const litecoinSock = new zmq.Subscriber;
    const litecoinRpc = new RpcClient(config.litecoin.rpc);
    const notifyer = new LitecoinNotifyer(config.litecoin.worker, litecoinSock);
    const service = new LitecoinNodeService(litecoinRpc);

    return { blockchain: "litecoin", notifyer:  notifyer, service: service};
  }

  return {createApi, getApiArray}
}

module.exports = FullnodeApiFactory;
