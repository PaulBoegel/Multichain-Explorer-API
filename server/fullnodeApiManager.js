"use strict";

const EventEmitter = require('events');

function FullnodeApiManager(config) {

  const apiArray = []
  const events = new EventEmitter();

  function setApi(api) {
    if (typeof api === undefined || api == null)
      throw new ReferenceError('api array is not defined.');

    apiArray.push(api);
  }

  function activateAllAPIs() {
    if (apiArray.length == 0)
      throw 'Service array is empty.';

    apiArray.forEach(async (api) => {
      await initAPI(api);
    });
  }

  async function activateAPI(blockchainName) {
    try {
      if (notifyerArray.length == 0)
        throw 'Notifyer array is empty.';

      const api = apiArray.find(item => item.blockchain == blockchainName);
      await initAPI(api);
    } catch (err) {
      throw err;
    }
  }

  async function initAPI(api) {
    try {
      api.service.events.addListener('onNewRelation', onNewTransaction);
      api.notifyer.events.addListener('onNewTransaction', onNewTransaction);
      await api.notifyer.connectToSocket();
      await api.notifyer.subscribeToTransactions();
    } catch (err) {
      throw err;
    }
  }

  async function getTransactionFromNode(blockchainName, txid) {
    try {
      const api = apiArray.find(item => item.blockchain == blockchainName);
      return await api.service.getTransaction(txid, true);
    } catch (err) {
      throw err;
    }
  }

  function onNewTransaction(transaction, relationDepth, chainname) {
    const api = apiArray.find(item => item.blockchain == chainname);
    events.emit('onNewTransaction', transaction, relationDepth, api.service);
  }

  return { activateAllAPIs, activateAPI, setApi, getTransactionFromNode, events }
}

module.exports = FullnodeApiManager;
