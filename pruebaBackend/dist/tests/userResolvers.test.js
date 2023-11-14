// __tests__/userResolvers.test.ts
const { resolversDef } = require('../graphql/Resolvers/resolversDef');
const { UserInputError } = require('apollo-server-errors');
// Mockear el objeto prisma para las pruebas
jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn().mockImplementation(() => ({
        user: {
            findUnique: jest.fn(),
        },
    })),
}));
describe('userByEmail', () => {
    it('debería devolver un usuario existente', async () => {
        const mockUserData = {
            id: 1,
            name: 'Usuario de Prueba',
            email: 'usuario.prueba@test.com',
        };
        // Configurar el mock para devolver datos de prueba
        const mockedPrisma = new (require('@prisma/client').PrismaClient)();
        mockedPrisma.user.findUnique.mockResolvedValue(mockUserData);
        // Llamar a la función userByEmail directamente
        const result = await resolversDef.Query.userByEmail(null, { email: 'usuario.prueba@test.com' }, { prisma: mockedPrisma });
        // Realizar la afirmación (assertion) aquí
        expect(result).toEqual(mockUserData);
    });
    it('debería lanzar un error si el usuario no existe', async () => {
        // Configurar el mock para devolver null, indicando que el usuario no existe
        const mockedPrisma = new (require('@prisma/client').PrismaClient)();
        mockedPrisma.user.findUnique.mockResolvedValue(null);
        // Llamar a la función userByEmail directamente
        try {
            await resolversDef.Query.userByEmail(null, { email: 'usuario.inexistente@test.com' }, { prisma: mockedPrisma });
        }
        catch (error) {
            // Verificar que se lance un UserInputError
            expect(error).toBeInstanceOf(UserInputError);
            expect(error.message).toContain('Usuario con el correo usuario.inexistente@test.com no encontrado');
        }
    });
    // Puedes agregar más pruebas según sea necesario
});
