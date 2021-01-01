const { ApolloServer } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");
const Resolvers = require("./resolvers");
const Schema = require("./schema");

function Service({ controllerManager }) {
  const executebleSchema = makeExecutableSchema({
    typeDefs: Schema,
    resolvers: Resolvers({ controllerManager }),
  });

  return new ApolloServer({
    schema: executebleSchema,
    context: ({ req }) => req,
  });
}

module.exports = Service;
