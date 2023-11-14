import { PrismaClient } from '@prisma/client';
import { UserInputError } from 'apollo-server-errors';

/**
 * Crear una instancia de Prisma Client
 */

const prisma = new PrismaClient();

const resolversDef = {
    Query: {

      /**
       * @returns // Obtener todos los usuarios
       */
      allUsers: async () => {
        try {
          const data = await prisma.$queryRaw`SELECT * FROM "User"`;
          return data;
        } catch (error) {
          console.error("Error fetching users:", error);
          throw new Error("Internal server error");
        }
      },
      
      /**
       * 
       * @param parent 
       * @param String
       * @returns Obtener usuario por ID
       */
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
        } catch (error) {
          console.error("Error fetching user by id:", error);
          throw error; 
        }
      },
  

      /**
       * 
       * @param parent 
       * @param String
       * @returns Obtener usuario por correo electrónico
       */
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
        } catch (error) {
          console.error("Error al ejecutar la consulta:", error);
          throw error;
        }
      },
      
      /**
       * 
       * @returns Obtener todos los países para Admin y Manager
       */
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
        } catch (error) {
          console.error("Error al ejecutar la consulta:", error);
          throw error;
        }
      },
  

      /**
       * 
       * @param parent 
       * @param String
       * @returns Obtener monitoreos de usuario por correo electrónico y rango de tiempo
       */
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
        } catch (error) {
          console.error("Error fetching user monitorings by email and time range:", error);
          throw error;
        }
      },
      

      /**
       * 
       * @param parent 
       * @param String 
       * @returns Obtener los mejores usuarios en un rango de tiempo
       */
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
      
          
          const userIds = data.map((item) => item.userId).filter((userId) => userId !== null);
          console.log(userIds);
          
          
          if (userIds.length > 0) {
            return userIds;
          } else {
            return [];
          }
        } catch (error) {
          console.error("Error al ejecutar la consulta:", error);
          throw error;
        }
      },
      
  
  /**
   * 
   * @param parent 
   * @param String
   * @returns Obtener los mejores usuarios por tipo y país en un rango de tiempo
   */
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
        } catch (error) {
          console.error("Error al ejecutar la consulta:", error);
          throw error;
        }
      },
    },
  };


  export { resolversDef };