const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const LitecoinNotifyer = require('../../server/notifyer/litecoinNotifyer');

chai.use(chaiAsPromised);
chai.should();

let litecoinNotifyer;
let sockMock;
let rpcMock;

describe('litecoinNotifyer', function () {

  const workerConf = {
    host: "127.0.0.1",
    port: "3333"
  }

  const rpc = {decodeRawTransaction: (transaction, callback) => {}};
  const sock = {connect: (url) => {}, subscribe: (opt) => {}};
  sock[Symbol.asyncIterator] = function(){
    return {
      i: 0,
      async next(){
        if(this.i == 0){
          this.i++;
          return Promise.resolve({value: ["topic", "transaction massage"], done: false})
        }
        return Promise.resolve({done:true});
      }
    }
  }

  beforeEach(function () {
    sockMock = sinon.mock(sock);
    rpcMock = sinon.mock(rpc);
    litecoinNotifyer = new LitecoinNotifyer(workerConf, rpc, sock);
  });

  describe('connectToSocket', function () {

    it('should connect with tcp url', async function () {

      sockMock.expects('connect').once().withExactArgs('tcp://127.0.0.1:3333');

      await litecoinNotifyer.connectToSocket();

      sockMock.verify();
    });

  });

  describe('subscribeToTransactions', function () {

    it('should subscribe to rawtx', async function(){

        sockMock.expects('subscribe').once().withExactArgs('rawtx');

        await litecoinNotifyer.subscribeToTransactions();

        sockMock.verify();
    });

    it('should decode the raw transaction', async function(){

      rpcMock.expects('decodeRawTransaction').once().withArgs("transaction massage");

      await litecoinNotifyer.subscribeToTransactions();

      rpcMock.verify();
    });

  });

  afterEach(function(){
    sinon.restore();
  });
});
