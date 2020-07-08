"use strict";

const EventEmitter = require('events');

function FullnodeApiManager(config) {

  const apiArray = []
  const events = new EventEmitter();

  function setApi(api){
    if(typeof api === undefined || api == null)
      throw new ReferenceError('api array is not defined.');

    apiArray.push(api);
  }

  function activateAllNotifyer() {
    if(apiArray.length == 0)
      throw 'Service array is empty.';

    apiArray.forEach((api) => {
      api.notifyer.events.addListener('onNewTransaction', onNewTransaction);
      api.notifyer.connectToSocket();
      api.notifyer.subscribeToTransactions();
    });
  }

  function activateNotifyer(blockchainName) {
    if(notifyerArray.length == 0)
      throw 'Notifyer array is empty.';

    const api = apiArray.find(item => item.blockchain == blockchainName);
    api.notifyer.connectToSocket();
    api.notifyer.subscribeToTransactions();
  }

  function onNewTransaction(transaction, blockchainName){
    const api = apiArray.find(item => item.blockchain == blockchainName);
    events.emit('onNewTransaction', transaction, api.service);
  }

  return { activateAllNotifyer, activateNotifyer, setApi, events }
}

module.exports = FullnodeApiManager;
