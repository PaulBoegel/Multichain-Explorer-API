const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fs = require('fs');
const litecoinFullnodeNotifyer = require('../../server/node_notifyer/litecoinFullnodeNotifyer');

chai.use(chaiAsPromised);
chai.should();

describe('litecoinFullnodeNotifyer', function() {
    describe('instantiation', function(){
        it('should throw an exception, if no config file exists', function(){
            
        })
    });
    describe('connectToSocket', function(){

    });
    describe('subscribeToTransactions', function(){

    })
});
