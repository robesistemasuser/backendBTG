import { Request, Response } from 'express';
import { 
  createUserFundRelation, 
  deleteUserFundRelation, 
  deactivateUserFundRelation, 
  activateUserFundRelation, 
  updateUserFundRelation, 
  getUserFunds 
} from '../services/userFundsServices';
import { UserFunds } from '../models/userFunds';

// Controlador para crear una relación entre un usuario y un fondo
export const createUserFund = async (req: Request, res: Response) => {
  const userFundData: Omit<UserFunds, 'subscriptionDate'| 'createdAt'> = req.body; 

  try {

    const userFunds: UserFunds = {
      createdAt: new Date().toISOString(),
      subscriptionDate: new Date().toISOString(),
      ...userFundData,    
    }; 
    const result = await createUserFundRelation(userFundData);
    res.status(result.statusCode).json(result);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al crear la relación usuario-fondo', error: error.message });
  }
};

// Controlador para eliminar una relación entre un usuario y un fondo
export const deleteUserFund = async (req: Request, res: Response) => {
  const { userId, fundId } = req.params;

  try {
    await deleteUserFundRelation(userId, fundId);
    res.status(200).json({ message: 'Relación usuario-fondo eliminada exitosamente' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al eliminar la relación usuario-fondo', error: error.message });
  }
};

// Controlador para desactivar una relación entre un usuario y un fondo
export const deactivateUserFund = async (req: Request, res: Response) => {
  const { userId, fundId } = req.params;

  try {
    await deactivateUserFundRelation(userId, fundId);
    res.status(200).json({ message: 'Relación usuario-fondo desactivada exitosamente' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al desactivar la relación usuario-fondo', error: error.message });
  }
};

// Controlador para activar una relación entre un usuario y un fondo
export const activateUserFund = async (req: Request, res: Response) => {
  const { userId, fundId } = req.params;

  try {
    await activateUserFundRelation(userId, fundId);
    res.status(200).json({ message: 'Relación usuario-fondo activada exitosamente' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al activar la relación usuario-fondo', error: error.message });
  }
};

// Controlador para actualizar una relación entre un usuario y un fondo
export const updateUserFund = async (req: Request, res: Response) => {
  const { userId, fundId } = req.params;
  const updates: Partial<UserFunds> = req.body;

  try {
    await updateUserFundRelation(userId, fundId, updates);
    res.status(200).json({ message: 'Relación usuario-fondo actualizada exitosamente' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al actualizar la relación usuario-fondo', error: error.message });
  }
};

// Controlador para obtener todas las relaciones de fondos de un usuario
export const getUserFundsController = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const userFunds = await getUserFunds(userId);
    res.status(200).json(userFunds);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener las relaciones usuario-fondo', error: error.message });
  }
};
