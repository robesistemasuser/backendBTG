import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid'; 
import { subscribeFund, cancelFund, getFunds, getFundsId } from '../services/fundService';
import { Fund } from '../models/fund';

// Controlador para crear un fondo
export const createFund = async (req: Request, res: Response): Promise<void> => {
  try {
    // Generar un nuevo UUID para el fondo
    const fundData: Omit<Fund, 'id' | 'createdAt'> = {
      ...req.body,
      id: uuidv4(), // Agrega el UUID al objeto de datos del fondo
    };

    const newFund = await subscribeFund(fundData); // Llama al servicio para suscribir al fondo
    res.status(201).json(newFund); // Devuelve el fondo creado
  } catch (error) {
    handleError(res, error, 'creating the fund');
  }
};



// Controlador para listar todos los fondos
export const listFunds = async (req: Request, res: Response) => {
  try {
    const funds = await getFunds(); // Llama al servicio para obtener todos los fondos
    res.status(200).json(funds); // Devuelve la lista de fondos
  } catch (error) {
    handleError(res, error, 'fetching the funds');
  }
};

// Controlador para eliminar un fondo
export const removeFund = async (req: Request, res: Response) => {
  const { id } = req.params; // Obtiene el ID del fondo de los parámetros de la ruta
  try {
    await cancelFund(id); // Llama al servicio para cancelar el fondo
    res.status(200).json({ message: `Fund with ID ${id} deleted successfully` });
  } catch (error) {
    handleError(res, error, 'deleting the fund');
  }
};

// Función reutilizable para manejar errores
const handleError = (res: Response, error: unknown, action: string) => {
  if (error instanceof Error) {
    res.status(500).json({ message: `Error ${action}: ${error.message}` });
  } else {
    res.status(500).json({ message: `Unexpected error occurred while ${action}` });
  }
};

// Controlador para obtener fondo por fundId
export const getFundsByFundId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; 
    const funds = await getFundsId(id);
    if (!funds || funds.length === 0) {
      res.status(404).json({ message: 'No se encontro fondo para este usuario' });
    } else {
      res.status(200).json(funds);
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener el fondo', error: error.message });
  }
};