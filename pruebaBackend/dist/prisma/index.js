import { PrismaClient } from '@prisma/client';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
// import { verify } from 'jsonwebtoken';
import { TypeDef } from '../graphql/types/types';
import { resolversDef } from '../graphql/Resolvers/resolversDef';
const prisma = new PrismaClient();
// Define el esquema GraphQL con Apollo Server
const typeDefs = `
 ${TypeDef}

  type Query {
    allUsers(page: Int, pageSize: Int): [User]!
    userById(id: ID!): User
    userByEmail(email: String!): User
    allCountriesForAdminAndManager: [Country]!
    userMonitoringsByEmailAndTimeRange(email: String! startTime: String!  endTime: String!): [UserMonitoring]!
    getTopUsersInTimeRange(startTime: String!  endTime: String!): [User]!
    getTopUsersByTypeAndCountry(type: String! countryId: ID!  startTime: String! endTime: String!): [User]!
  }
`;
const resolvers = resolversDef;
const serverConfig = {
    typeDefs,
    resolvers,
    context: { prisma },
};
const server = new ApolloServer(serverConfig);
const { url } = await startStandaloneServer(server);
console.log(`Servidor listo en ${url}`);
