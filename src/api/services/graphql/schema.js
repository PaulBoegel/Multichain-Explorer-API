const { gql } = require("apollo-server-express");
const typeDefinitions = gql`
  type AddressRelation {
    address: [String]
    value: Float
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
    tx: [Transaction]
  }

  type RootQuery {
    blocks(height: Int, chainId: Int): [Block]
  }

  schema {
    query: RootQuery
  }
`;

module.exports = [typeDefinitions];
