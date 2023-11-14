import { PrismaClient } from '@prisma/client';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
// import { verify } from 'jsonwebtoken';  
import { TypeDef } from '../graphql/types/types';
import { resolversDef } from '../graphql/Resolvers/resolversDef';

/**
 * Instancia de Prisma Client para interactuar con la base de datos
 */
const prisma = new PrismaClient();


const typeDefs = `
  ${TypeDef}

  type Query {
    allUsers(page: Int, pageSize: Int): [User]! # Consulta para obtener todos los usuarios paginados
    userById(id: ID!): User # Consulta para obtener un usuario por su ID
    userByEmail(email: String!): User # Consulta para obtener un usuario por su correo electrónico
    allCountriesForAdminAndManager: [Country]! # Consulta para obtener todos los países para Admin y Manager
    userMonitoringsByEmailAndTimeRange(email: String!, startTime: String!, endTime: String!): [UserMonitoring]! # Consulta para obtener monitoreos de usuario por correo electrónico y rango de tiempo
    getTopUsersInTimeRange(startTime: String!, endTime: String!): [User]! # Consulta para obtener los mejores usuarios en un rango de tiempo
    getTopUsersByTypeAndCountry(type: String!, countryId: ID!, startTime: String!, endTime: String!): [User]! # Consulta para obtener los mejores usuarios por tipo y país en un rango de tiempo
  }
`;

/**
 * Definición de resolvers utilizando los resolvers previamente definidos
 */

const resolvers = resolversDef;

/**
 * Configuración del servidor Apollo
 */
const serverConfig = {
  typeDefs,
  resolvers,
  context: { prisma },
};

/**
 * Creación de una instancia del servidor Apollo
 */
const server = new ApolloServer(serverConfig);


const { url } = await startStandaloneServer(server);
console.log(`Servidor listo en ${url}`); 
