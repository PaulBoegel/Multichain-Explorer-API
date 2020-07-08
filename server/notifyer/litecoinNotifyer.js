const EventEmitter = require('events');

function LitecoinNotifyer(workerConf, sock) {

  if(typeof workerConf === undefined || workerConf == null)
    throw new ReferenceError("No worker conf defined");
  if(typeof sock === undefined || sock == null)
    throw new ReferenceError("No tcp socket defined");

  const events = new EventEmitter();

  async function connectToSocket() {
    try {
      await sock.connect(`tcp://${workerConf.host}:${workerConf.port}`);
      console.log(`Litecoin worker connected to port ${workerConf.port}`);
    } catch (e) {
      throw e;
    }
  }

  async function subscribeToTransactions() {
    try {
      sock.subscribe("rawtx")
      for await (const [topic, msg] of sock) {
        events.emit('onNewTransaction', msg, "litecoin");
      }
    } catch (e) {
      throw e;
    }
  }

  return { connectToSocket, subscribeToTransactions, events }
}

module.exports = LitecoinNotifyer;
