import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs as recipeTypeDefs } from './schema';
import { resolvers as recipeResolvers } from './resolvers';
import { typeDefs as spoonacularTypeDefs } from './schema';
import { resolvers as spoonacularResolvers } from './resolvers';

export async function createApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  return server;
}

export { expressMiddleware };