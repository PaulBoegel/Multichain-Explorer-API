const { ApolloServer } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");
const Resolvers = require("./resolvers");
const Schema = require("./schema");

function Service({ queryBuilderManager }) {
  const executebleSchema = makeExecutableSchema({
    typeDefs: Schema,
    resolvers: Resolvers({ queryBuilderManager }),
  });

  return new ApolloServer({
    schema: executebleSchema,
    context: ({ req }) => req,
  });
}

module.exports = Service;
