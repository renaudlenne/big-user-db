import express from 'express'
import { ApolloServer, gql } from 'apollo-server-express';

import schema from './graphql/schema';

const port = process.env.PORT || 2626;

const app = express();

const server = new ApolloServer({ schema });

server.applyMiddleware({ app });

app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
);

