import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/user'; 
import { addUser, deleteUser, getUserById, updateUser, getAllUsers, getUserByDocument } from '../services/userService';

// Controlador para agregar un usuario
export const createUser = async (req: Request, res: Response): Promise<void> => {
  const userData: Omit<User, 'id'| 'createdAt'> = req.body; // Omitir el campo 'id' al recibir datos
  try {
    const user: User = {
      id: uuidv4(), // Generar un UUID para el nuevo usuario
      createdAt: new Date().toISOString(),
      ...userData,   // Desestructurar el resto de los datos del usuario
    };

    await addUser(user); // Llama a la función para agregar el usuario
    res.status(201).json({ message: 'Usuario creado exitosamente', user }); // Respuesta exitosa con datos del usuario creado
  } catch (error: any) {
    console.error('Error al crear el usuario:', error); // Registro del error
    res.status(500).json({ error: error.message || 'Error desconocido' }); // Respuesta de error
  }
};

// Controlador para obtener un usuario por ID
export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const user = await getUserById(id);
    if (user) {
      res.status(200).json(user); // Enviar el usuario si es encontrado
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' }); // Respuesta en caso de no encontrar el usuario
    }
  } catch (error: any) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ error: error.message || 'Error desconocido' }); // Manejo de errores
  }
};

// Controlador para actualizar un usuario
export const updateUserById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updatedData: Partial<User> = req.body; // Datos actualizados
  try {
    const user = await updateUser(id, updatedData);
    if (user) {
      res.status(200).json({ message: 'Usuario actualizado exitosamente', user }); // Devolver el usuario actualizado
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error: any) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ error: error.message || 'Error desconocido' });
  }
};

// Controlador para eliminar un usuario
export const deleteUserById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const isDeleted = await deleteUser(id); // Verificar si el usuario fue eliminado
    if (isDeleted) {
      res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error: any) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ error: error.message || 'Error desconocido' });
  }
};

// Controlador para obtener todos los usuarios
export const getAllUsersController = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users); // Enviar todos los usuarios
  } catch (error: any) {
    console.error('Error al obtener todos los usuarios:', error);
    res.status(500).json({ error: error.message || 'Error desconocido' });
  }
};

// Controlador para obtener un usuario por documento
export const getUserByDocumentController = async (req: Request, res: Response): Promise<void> => {
  const { documento } = req.params;
  try {
    const user = await getUserByDocument(documento);
    if (user) {
      res.status(200).json(user); // Enviar el usuario si es encontrado
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error: any) {
    console.error('Error al obtener el usuario por documento:', error);
    res.status(500).json({ error: error.message || 'Error desconocido' });
  }
};
