"user-strict";

const zmq = require("zeromq");
const LitecoinNotifyer = require("./notifyer/litecoinNotifyer");

function FullnodeNotifyerFactory(config) {
  function createNotifyer(blockchainName) {
    switch (blockchainName) {
      case config.litecoin.chainname:
        return createLitecoinNotifyer();
        break;
    }
  }

  function createLitecoinNotifyer() {
    const litecoinSock = new zmq.Subscriber();
    return new LitecoinNotifyer(config.litecoin, litecoinSock);
  }

  return { createNotifyer };
}

module.exports = FullnodeNotifyerFactory;
