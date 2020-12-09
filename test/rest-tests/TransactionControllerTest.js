const { assert } = require("chai");
const sinon = require("sinon");
const TransactionController = require("../../src/api/controllers/transactionController");
const TransactionRepository = require("../../src/lib/repos/transactionRepository");
const RequestMockFactory = require("../mocks/requestMockFactory");
const ResponseMockFactory = require("../mocks/responseMockFactory");
const transactionMocks = require("../mocks/transactionsMock.json");
const { MongoClient } = require("mongodb");

function getDbConfig() {
  return {
    host: "127.0.0.1",
    port: "",
    dbName: "transactionControllerTests",
    poolSize: "10",
  };
}

describe("TransactionController getOutput", () => {
  let transactionRepository, transactionController;
  before(async () => {
    transactionRepository = TransactionRepository(getDbConfig());
    await transactionRepository.connect();
    await transactionRepository.addMany(transactionMocks);
    transactionController = TransactionController(transactionRepository);
  });

  it("should return output transactions with address as vin value", async () => {
    const req = RequestMockFactory({
      chainId: 0,
      txid: "8f3254b44fea26b85a9e563c944f164f7e855527711eaa2eede26d7df0e4df07",
    });
    const resp = ResponseMockFactory();
    const resultSpy = sinon.spy(resp, "send");
    const result = await transactionRepository.getByIds(
      "c5ff4f777dc5a8306c12cc20bb555a4279d9e49572f42eeabec40663fab3a876",
      0
    );
    result.address = "XmAQzotAmP25xnhrjN6hsnKqWw89Pdsn3T";
    await transactionController.getOutput(req, resp);

    assert(resultSpy.withArgs(JSON.stringify([result], null, 4)).calledOnce);
  });
});

after(async () => {
  const { host, dbName, port } = getDbConfig();
  const url = `mongodb://${host}:${port}`;
  const client = new MongoClient(url);
  await client.connect();
  await client.db(dbName).dropDatabase();
  client.close();
});
