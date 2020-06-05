const zmq = require('zeromq');
const sock = new zmq.Subscriber;
const RpcClient = require('bitcoind-rpc');

function litecoinFullnodeNotifyer(conf){
    
    if(conf == null || conf == undefined){
        throw new Exception('config file is undefined');
    }

    const rpc = new RpcClient(conf.rpc);

    async function connectToSocket(conf){
        try {
            await sock.connect(`tcp://${conf.host}:${conf.port}`);
            console.log(`Litecoin worker connected to port ${conf.port}`);
        } catch(e){
            console.log(e);
            throw e;
        }
    }
    
    async function subscribeToTransactions(){
        try {
            sock.subscribe("rawtx")
        
            for await (const [topic, msg] of sock) {
                console.log(`Received message: ${msg.toString('hex')} for topic: ${topic.toString()}`)
                decodeTransaction(msg);
            }
        } catch(e){
            console.log(e);
            throw e;
        }
    }
    
    function decodeTransaction(transaction){
        try {
            rpc.decodeRawTransaction(transaction.toString('hex'), (err, resp) => {
                console.log(JSON.stringify(resp, null, 4))
            });
        } catch (e){
            console.log(e);
            throw e;
        }
    }

    return { connectToSocket, subscribeToTransactions }
}

module.exports = litecoinFullnodeNotifyer();
