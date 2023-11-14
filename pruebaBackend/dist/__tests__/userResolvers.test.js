import { ApolloServer, gql } from '@apollo/server';
import { createTestClient } from '';
import { PrismaClient } from '@prisma/client';
import { resolvers } from './resolvers'; // Ajusta la ruta según tu estructura de archivos
const prisma = new PrismaClient();
const server = new ApolloServer({
    typeDefs: gql `
    type Query {
      allUsers: [User]!
    }

    type User {
      id: ID!
      name: String!
      email: String!
      roleId: String!
    }
  `,
    resolvers,
    context: { prisma },
});
const { query } = createTestClient(server);
describe('allUsers resolver', () => {
    it('should return all users', async () => {
        const result = await query({
            query: gql `
        query {
          allUsers {
            id
            name
            email
            roleId
          }
        }
      `,
        });
        expect(result.errors).toBeUndefined();
        expect(result.data).toBeDefined();
        expect(result.data?.allUsers).toHaveLength( /* Número esperado de usuarios */);
    });
});
