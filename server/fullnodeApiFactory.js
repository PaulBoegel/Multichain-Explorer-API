"use strict";

const LitecoinNotifyer = require('./notifyer/litecoinNotifyer');
const LitecoinNodeService = require('./services/litecoinNodeService');
const { RPCClient } = require("rpc-bitcoin");
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
    const conf = config.litecoin.rpc;
    const litecoinRpc = new RPCClient({url: conf.url, user: conf.user, pass: conf.pass, port: conf.port});
    const notifyer = new LitecoinNotifyer(config.litecoin, litecoinSock);
    const service = new LitecoinNodeService(litecoinRpc);

    return { blockchain: "litecoin", notifyer:  notifyer, service: service};
  }

  return {createApi, getApiArray}
}

module.exports = FullnodeApiFactory;
