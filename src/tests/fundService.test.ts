import { Fund } from '../models/fund';
import { connectDB } from '../config/database'; 
import { subscribeFund, cancelFund, getFunds } from '../services/fundService';


jest.mock('../config/database', () => ({
    connectDB: jest.fn(), // Aquí moqueamos connectDB
  }));

  describe('Fund Service - Error handling', () => {
    it('should handle errors when fetching funds', async () => {
      // Moquea la implementación de connectDB para que lance un error
      (connectDB as jest.Mock).mockImplementationOnce(() => {
        throw new Error('DynamoDB error');
      });
  
      // Esperamos que al intentar obtener fondos, se lance un error
      await expect(getFunds()).rejects.toThrow('Failed to fetch funds: DynamoDB error');
    });
  });