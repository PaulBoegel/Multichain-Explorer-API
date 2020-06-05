const litecoinFullnodeNotifyer = require('./node_notifyer/litecoinFullnodeNotifyer')

function notificationManager(configIn){
    const config = configIn;

    function activateLitecoinNotifyer(){
        litecoinFullnodeNotifyer(config.litecoin);
        litecoinFullnodeNotifyer.connectToSocket();
        litecoinFullnodeNotifyer.subscribeToTransactions();
    }

    return { activateLitecoinNotifyer }
}

module.exports = notificationManager();