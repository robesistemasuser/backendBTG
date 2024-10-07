"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const fundService_1 = require("../services/fundService");
jest.mock('../config/database', () => ({
    connectDB: jest.fn(), // Aquí moqueamos connectDB
}));
describe('Fund Service - Error handling', () => {
    it('should handle errors when fetching funds', async () => {
        // Moquea la implementación de connectDB para que lance un error
        database_1.connectDB.mockImplementationOnce(() => {
            throw new Error('DynamoDB error');
        });
        // Esperamos que al intentar obtener fondos, se lance un error
        await expect((0, fundService_1.getFunds)()).rejects.toThrow('Failed to fetch funds: DynamoDB error');
    });
});
