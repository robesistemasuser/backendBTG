import { Request, Response } from 'express';
import { registerTransaction, getTransactionsByUser, getTransactionsByDocument } from '../services/transactionServices';
import { v4 as uuidv4 } from 'uuid'; // Importar el generador de UUID

// Controlador para crear una transacción
export const createTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const transaction = {
      ...req.body,
      transactionId: uuidv4(),
      transactionDate: new Date().toISOString(),
    };
    const result = await registerTransaction(transaction);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al registrar la transacción', error: error.message });
  }
};

// Controlador para obtener transacciones por userId
export const getTransactionsByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const transactions = await getTransactionsByUser(userId);
    if (!transactions || transactions.length === 0) {
      res.status(404).json({ message: 'No se encontraron transacciones para este usuario' });
    } else {
      res.status(200).json(transactions);
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener las transacciones', error: error.message });
  }
};

// Controlador para obtener transacciones por documento
export const getTransactionsByDocumento = async (req: Request, res: Response): Promise<void> => {
  try {
    const { documento } = req.params;
    const transactions = await getTransactionsByDocument(documento);
    if (!transactions || transactions.length === 0) {
      res.status(404).json({ message: 'No se encontraron transacciones para este documento' });
    } else {
      res.status(200).json(transactions);
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener las transacciones', error: error.message });
  }
};
