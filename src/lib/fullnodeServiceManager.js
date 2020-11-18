"user-strict";
const EventEmitter = require("events");

function FullnodeServiceManager() {
  const events = new EventEmitter();
  const serviceArray = [];

  function setService(service) {
    serviceArray.push(service);
  }

  function getService(chainname) {
    return serviceArray.find((item) => item.chainname == chainname);
  }

  return {
    setService,
    getService,
    events,
  };
}

module.exports = FullnodeServiceManager;
