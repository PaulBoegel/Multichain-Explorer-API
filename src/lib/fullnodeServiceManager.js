"user-strict";
const EventEmitter = require("events");

function FullnodeServiceManager() {
  const events = new EventEmitter();
  const serviceArray = [];

  function setService(service) {
    serviceArray.push(service);
  }

  function getService(chainId) {
    return serviceArray.find((item) => item.chainId == chainId);
  }

  return {
    setService,
    getService,
    events,
  };
}

module.exports = FullnodeServiceManager;
