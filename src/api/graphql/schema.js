const { gql } = require("apollo-server-express");
const typeDefinitions = gql`
  type AddressRelation {
    address: [String]
    value: Float
    coinbase: Boolean
  }

  type Transaction {
    txid: String
    from: [AddressRelation]
    to: [AddressRelation]
  }

  type Block {
    hash: String
    height: Int
    chainId: Int
    parent: String
    mined: String
    tx: [Transaction]
  }

  type RootQuery {
    blocks(height: Int, hash: String, chainId: Int): [Block]
    transactions(txid: String, chainId: Int): [Block]
    address(address: String, chainId: Int): [Block]
    searchEntity(searchString: String, chainId: Int): Int
  }

  schema {
    query: RootQuery
  }
`;

module.exports = [typeDefinitions];
