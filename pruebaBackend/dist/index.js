import { PrismaClient } from '@prisma/client';
import { ApolloServer } from '@apollo/server';
import { UserInputError } from 'apollo-server-errors';
import { startStandaloneServer } from '@apollo/server/standalone';
const prisma = new PrismaClient();
// Define el esquema GraphQL con Apollo Server
const typeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
    roleId: String!
  }

  type Country {
    id: ID!
    name: String!
  }

  type UserMonitoring {
    id: ID!
    usage: Int!
    description: String!
    userId: ID!
    createdAt: String! # Assuming createdAt will be returned as a string
  }

  type CountUserTop {
    id: ID!
    userId: ID!
    userName: String! # Nueva propiedad para almacenar el nombre del usuario
    description: String!
    numberRecords: String!
  }

  type TopUser {
    id: ID!
    userId: ID!
  }

  type Query {
    allUsers(page: Int, pageSize: Int): [User]!
    userById(id: ID!): User
    userByEmail(email: String!): User
    allCountriesForAdminAndManager: [Country]!
    userMonitoringsByEmailAndTimeRange(email: String! startTime: String!  endTime: String!): [UserMonitoring]!
    getTopUsersInTimeRange(startTime: String!  endTime: String!): [TopUser]!
    getTopUsersByTypeAndCountry(type: String! countryId: ID!  startTime: String! endTime: String!): [User]!
  }
`;
const resolvers = {
    Query: {
        allUsers: async () => {
            try {
                // Example of raw SQL query
                const data = await prisma.$queryRaw `SELECT * FROM "User"`;
                return data;
            }
            catch (error) {
                console.error("Error fetching users:", error);
                throw new Error("Internal server error");
            }
        },
        userById: async (parent, { id }) => {
            try {
                const user = await prisma.user.findUnique({
                    where: {
                        id: id,
                    },
                });
                if (!user) {
                    throw new UserInputError(`Usuario con id ${id} no encontrado`);
                }
                return user;
            }
            catch (error) {
                console.error("Error fetching user by id:", error);
                throw error; // Lanza el error capturado directamente
            }
        },
        userByEmail: async (parent, { email }) => {
            try {
                const data = await prisma.user.findUnique({
                    where: {
                        email: email,
                    },
                });
                if (!data) {
                    throw new UserInputError(`Usuario con el correo ${email} no encontrado`);
                }
                return data;
            }
            catch (error) {
                console.error("Error al ejecutar la consulta:", error);
                throw error;
            }
        },
        allCountriesForAdminAndManager: async () => {
            try {
                const data = await prisma.country.findMany({
                    where: {
                        User: {
                            some: {
                                Role: {
                                    name: {
                                        in: ['Admin', 'Manager'],
                                    },
                                },
                            },
                        },
                    },
                });
                if (!data) {
                    throw new UserInputError("No se han encontrado la ciudad para Admin o Manager");
                }
                return data;
            }
            catch (error) {
                console.error("Error al ejecutar la consulta:", error);
                throw error;
            }
        },
        userMonitoringsByEmailAndTimeRange: async (parent, { email, startTime, endTime }) => {
            try {
                const user = await prisma.user.findUnique({
                    where: {
                        email: email,
                    },
                    select: {
                        id: true,
                    },
                });
                if (!user) {
                    throw new UserInputError(`Usuario con el correo ${email} no encontrado`);
                }
                const userMonitorings = await prisma.userMonitoring.findMany({
                    where: {
                        userId: user.id,
                        createdAt: {
                            gte: new Date(startTime),
                            lte: new Date(endTime),
                        },
                    },
                });
                return userMonitorings;
            }
            catch (error) {
                console.error("Error fetching user monitorings by email and time range:", error);
                throw error;
            }
        },
        getTopUsersInTimeRange: async (parent, { startTime, endTime }) => {
            try {
                const data = await prisma.userMonitoring.findMany({
                    where: {
                        createdAt: {
                            gte: new Date(startTime),
                            lte: new Date(endTime),
                        },
                    },
                    orderBy: {
                        usage: 'desc',
                    },
                    take: 3,
                    select: {
                        userId: true,
                    },
                });
                // Extract userIds from the result
                const userIds = data.map((item) => item.userId);
                // Return only userIds
                return userIds;
            }
            catch (error) {
                console.error("Error al ejecutar la consulta:", error);
                throw error;
            }
        },
        getTopUsersByTypeAndCountry: async (parent, { type, countryId, startTime, endTime }) => {
            try {
                const data = await prisma.user.findMany({
                    where: {
                        Country: {
                            some: {
                                id: countryId,
                            },
                        },
                        createdAt: {
                            gte: new Date(startTime),
                            lte: new Date(endTime),
                        },
                        UserMonitoring: {
                            some: {
                                description: {
                                    in: [type],
                                },
                            },
                        },
                    },
                    orderBy: {
                        UserMonitoring: {
                            _count: 'desc',
                        },
                    },
                    take: 3,
                });
                return data;
            }
            catch (error) {
                console.error("Error al ejecutar la consulta:", error);
                throw error;
            }
        },
    },
};
const serverConfig = {
    typeDefs,
    resolvers,
    context: { prisma },
};
const server = new ApolloServer(serverConfig);
const { url } = await startStandaloneServer(server);
console.log(`Servidor listo en ${url}`);
