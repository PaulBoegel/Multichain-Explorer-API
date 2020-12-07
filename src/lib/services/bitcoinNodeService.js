const request = require("request");
function BitcoinNodeService(rpcConf, chainname) {
  function _fetchBlockData(options) {
    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          const data = JSON.parse(body);
          resolve(data.result);
          return;
        }
        reject(error);
      });
    });
  }

  function _createOptions(body) {
    return {
      url: `http://${rpcConf.user}:${rpcConf.pass}@${rpcConf.host}:${rpcConf.port}`,
      method: "POST",
      headers: {
        "content-type": "text/plain",
      },
      body,
    };
  }

  return {
    chainname,
    async getTransaction({ txid, verbose = false }) {
      return await rpc.getrawtransaction({ txid, verbose });
    },
    async getBlockchainInfo() {
      const body = `{"jsonrpc":"1.0","id":"curltext","method":"getblockchaininfo","params":[]}`;
      const options = _createOptions(body);
      return await _fetchBlockData(options);
    },
    async getBlock({ blockhash, verbose }) {
      const verbosity = verbose ? 2 : 0;
      const body = `{"jsonrpc":"1.0","id":"curltext","method":"getblock","params":["${blockhash}", ${verbosity}]}`;
      const options = _createOptions(body);
      return await _fetchBlockData.call(this, options);
    },
    async getBlockHash({ height }) {
      const body = `{"jsonrpc":"1.0","id":"curltext","method":"getblockhash","params":[${height}]}`;
      const options = _createOptions(body);
      return await _fetchBlockData(options);
    },
  };
}

module.exports = BitcoinNodeService;
