const LitecoinNotifyer = require('./notifyer/litecoinNotifyer');

function NotificationManager(configIn){

    const config = configIn;
    const notifyerArray = new Array();

    initNotifyer();

    function initNotifyer(){
      const litecoinNotifyer = {blockchain: "litecoin",  notifyer: new LitecoinNotifyer(config)};
      notifyerArray.push(litecoinNotifyer);
    }

    function activateAllNotifyer(){
      notifyerArray.forEach((item) => {
        item.notifyer.connectToSocket();
        item.notifyer.subscribeToTransactions();
      });
    }

    function activateNotifyer(blockchainName){
        const notifyerItem = notifyerArray.find(item => item.blockchain == blockchainName);
        notifyerItem.notifyer.connectToSocket();
        notifyerItem.notifyer.subscribeToTransactions();
    }

    return { activateAllNotifyer, activateNotifyer }
}

module.exports = NotificationManager;
