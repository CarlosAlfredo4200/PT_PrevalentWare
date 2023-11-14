import { PrismaClient } from '@prisma/client';
import { UserInputError } from 'apollo-server-errors';
const prisma = new PrismaClient();
const resolversDef = {
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
                    take: 4,
                    select: {
                        userId: true,
                    },
                });
                // Extract userIds from the result, filter out null values
                const userIds = data.map((item) => item.userId).filter((userId) => userId !== null);
                console.log(userIds);
                // Check if there are any userIds to return
                if (userIds.length > 0) {
                    return userIds;
                }
                else {
                    // If no userIds are found, you may want to handle this case appropriately
                    // For example, return an empty array or throw an error
                    return []; // Or throw new Error("No userIds found in the specified time range");
                }
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
export { resolversDef };
