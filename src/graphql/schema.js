import { makeExecutableSchema } from 'apollo-server-express';
import { GraphQLDate } from 'graphql-iso-date';
import merge from 'lodash/merge';

import typeDefs from './schema.graphql';
import resolvers from './resolvers';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: merge(
    {
      Date: GraphQLDate,
    },
    resolvers),
});

export default schema;
