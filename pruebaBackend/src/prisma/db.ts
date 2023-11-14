import { PrismaClient } from '@prisma/client';

/**
 * Objeto que representa la instancia de Prisma Client para interactuar con la base de datos.
 * Prisma Client facilita el acceso y la manipulación de la base de datos utilizando el ORM de Prisma.
 */
export const Prisma = new PrismaClient();
