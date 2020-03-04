import express from 'express'
import { ApolloServer, gql } from 'apollo-server-express';

import schema from './graphql/schema';
import indexingRouter from "./routes/indexingRouter";

const port = process.env.PORT || 2626;

const app = express();

app.use(express.json());

const server = new ApolloServer({
  schema,
  introspection: true,
});

server.applyMiddleware({ app });

app.use('/index', indexingRouter);

app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
);

