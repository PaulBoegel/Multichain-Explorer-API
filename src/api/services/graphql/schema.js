const { gql } = require("apollo-server-express");
const typeDefinitions = gql`
  type Transaction {
    txid: String
    from: [String]
    to: [String]
  }

  type Block {
    hash: String
    height: Int
    chainId: Int
    tx: [Transaction]
  }

  type RootQuery {
    blocks(height: Int, chainId: String): [Block]
  }

  schema {
    query: RootQuery
  }
`;

module.exports = [typeDefinitions];
