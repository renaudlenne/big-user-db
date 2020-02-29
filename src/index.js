import express from 'express'
import { ApolloServer, gql } from 'apollo-server-express';

import schema from './graphql/schema';

const app = express();

const server = new ApolloServer({ schema });

server.applyMiddleware({ app });

app.listen({ port: 2626 }, () =>
  console.log(`🚀 Server ready at http://localhost:2626${server.graphqlPath}`)
);

