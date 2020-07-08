const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const NotificationManager = require('../server/notificationManager');
chai.use(chaiAsPromised);
chai.should();

let notificationManager;
let notOne;
let notTwo;
let notOneMock;
let notTwoMock;

describe('notificationManager', function () {

  beforeEach(function () {
    notOne = { connectToSocket: () => { }, subscribeToTransactions: () => { } };
    notTwo = { connectToSocket: () => { }, subscribeToTransactions: () => { } };

    notOneMock = sinon.mock(notOne);
    notTwoMock = sinon.mock(notTwo);

    notOneItem = { blockchain: "blockchainOne", notifyer: notOne };
    notTwoItem = { blockchain: "blockchainTwo", notifyer: notTwo };
  });

  describe('activateAllNotifyer', function () {

    it('should connect to all sockets', function () {
      notificationManager = new NotificationManager();

      notificationManager.setNotifyerArrayItem(notOneItem);
      notificationManager.setNotifyerArrayItem(notTwoItem);

      notOneMock.expects('connectToSocket').once();
      notTwoMock.expects('connectToSocket').once();

      notificationManager.activateAllNotifyer();

      notOneMock.verify();
      notTwoMock.verify();
    });

    it('should subscribe to all transactions', function () {
      notificationManager = new NotificationManager();

      notificationManager.setNotifyerArrayItem(notOneItem);
      notificationManager.setNotifyerArrayItem(notTwoItem);

      notOneMock.expects('subscribeToTransactions').once();
      notTwoMock.expects('subscribeToTransactions').once();

      notificationManager.activateAllNotifyer();

      notOneMock.verify();
      notTwoMock.verify();
    })
  });

  describe('activateNotifyer', function () {

    it('should find a specific notifyer and connect to its socket', function () {
      notificationManager = new NotificationManager();

      notificationManager.setNotifyerArrayItem(notOneItem);
      notificationManager.setNotifyerArrayItem(notTwoItem);

      notOneMock.expects('connectToSocket').never();
      notTwoMock.expects('connectToSocket').once();

      notificationManager.activateNotifyer("blockchainTwo")

      notOneMock.verify();
      notTwoMock.verify();

    })

    it('should find a specific notifyer and subscribe to its transactions', function () {
      notificationManager = new NotificationManager();

      notificationManager.setNotifyerArrayItem(notOneItem);
      notificationManager.setNotifyerArrayItem(notTwoItem);

      notOneMock.expects('subscribeToTransactions').never();
      notTwoMock.expects('subscribeToTransactions').once();

      notificationManager.activateNotifyer("blockchainTwo")

      notOneMock.verify();
      notTwoMock.verify();

    })
  });

  afterEach(function () {
    sinon.restore();
  });
});
