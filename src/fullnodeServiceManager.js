"user-strict"
const EventEmitter = require('events');

function FullnodeServiceManager(){
  const events = new EventEmitter();
  const serviceArray = []

  function setService(service) {
    serviceArray.push(service);
  }

  function getService(chainname){
    return serviceArray.find(item => item.chainname == chainname);
  }

  function activateAllListeners() {
    if (serviceArray.length == 0)
      throw 'Service array is empty.';

    serviceArray.forEach(async (service) => {
      activateTransactionListener(service);
    });
  }

  function activateListener(chainname) {
    try {
      if (serviceArray.length == 0)
        throw 'Service array is empty.';

      const service = serviceArray.find(item => item.chainname == chainname);
      activateTransactionListener(service);
    } catch (err) {
      throw err;
    }
  }

  function activateTransactionListener(service){
    service.events.addListener('onNewInputs', onNewInputs);
  }

  function onNewInputs(inputs, inputDepth, chainname){
    events.emit("onNewInputs", inputs, inputDepth, getService(chainname));
  }

  return { activateListener, activateAllListeners, setService, getService, events }
}

module.exports = FullnodeServiceManager;
