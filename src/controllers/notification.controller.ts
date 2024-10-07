import { Request, Response, NextFunction } from 'express';
import { sendNotification } from '../services/notification.service'; // Asegúrate de que la ruta sea la correcta

// Controlador que maneja la lógica para enviar la notificación
export const sendNotificationController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { message, notifyBy } = req.body;

        // Llamar al servicio de notificación
        const result = await sendNotification(message, notifyBy);

        // Respuesta exitosa con el mensaje
        res.status(200).json({ message: result.message });
    } catch (error) {
        next(error); // Pasar el error al middleware de manejo de errores
    }
};
