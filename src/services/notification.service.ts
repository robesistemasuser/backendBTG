import nodemailer from 'nodemailer';
import twilio from 'twilio';

// Configuración de Twilio
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Configuración de Nodemailer (para correo electrónico)
const transporter = nodemailer.createTransport({
    service: 'gmail', // Cambia esto si usas otro proveedor
    auth: {
        user: process.env.EMAIL_USER, // El correo electrónico desde el cual se enviarán los correos
        pass: process.env.EMAIL_PASSWORD, // Contraseña del correo o app password
    },
});

import axios from 'axios';

const BASE_URL = 'http://190.156.150.149:3010';

/**
 * Enviar una notificación.
 * @param message - Mensaje de notificación a enviar.
 * @param notifyBy - Medio de notificación (correo, SMS, etc.).
 * @returns Un objeto con el mensaje de éxito o error.
 */
export const sendNotification = async (message: string, notifyBy: string): Promise<{ message: string }> => {
    try {console.log(`${BASE_URL}/notifications`, { message, notifyBy }, "Envio de notificacion");
        const response = await axios.post(`${BASE_URL}/notifications`, { message, notifyBy });

        // Asegurarte de que siempre retornes un objeto con el campo 'message'
        return { message: response.data.message || 'Notification sent successfully!' };
    } catch (error: any) {
        // En caso de error, retorna un objeto con el mensaje de error
        return { message: error.response?.data?.message || 'Error al enviar la notificación.' };
    }
};
