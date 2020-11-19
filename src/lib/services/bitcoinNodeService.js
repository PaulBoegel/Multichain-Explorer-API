"use strict";
function BitcoinNodeService(rpc, chainname) {
  return {
    async getTransaction({ txid, verbose = false }) {
      return await rpc.getrawtransaction({ txid, verbose });
    },
    async getBlockchainInfo() {
      return await rpc.getblockchaininfo();
    },
    async getBlock({ blockhash, verbose }) {
      const { height, hash, tx, nextblockhash } = await rpc.getblock({
        blockhash,
        verbosity: verbose ? 2 : 1,
      });
      return { height, hash, tx, nextblockhash };
    },
    async getBlockHash({ height }) {
      return await rpc.getblockhash({ height });
    },
  };
}

module.exports = BitcoinNodeService;
