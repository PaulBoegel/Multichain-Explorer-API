const zmq = require('zeromq');
const sock = new zmq.Subscriber;
const RpcClient = require('bitcoind-rpc');
let rpc = {};

function litecoinFullnodeNotifyer(conf){
    rpc = new RpcClient(conf.rpc);
    connectToSocket(conf.worker)
    subscribeToTransactions();
}

function connectToSocket(conf){
    sock.connect(`tcp://${conf.host}:${conf.port}`);
    console.log(`Litecoin worker connected to port ${conf.port}`);
}

async function subscribeToTransactions(){
    sock.subscribe("rawtx")

    for await (const [topic, msg] of sock) {
        console.log(`Received message: ${msg.toString('hex')} for topic: ${topic.toString()}`)
        decodeTransaction(msg);
    }
}

function decodeTransaction(transaction){
    rpc.decodeRawTransaction(transaction.toString('hex'), (err, resp) => {
        console.log(JSON.stringify(resp, null, 4))
    });
}

module.exports = litecoinFullnodeNotifyer;
