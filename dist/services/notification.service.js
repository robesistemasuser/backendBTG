"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const twilio_1 = __importDefault(require("twilio"));
// Configuración de Twilio
const twilioClient = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
// Configuración de Nodemailer (para correo electrónico)
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail', // Cambia esto si usas otro proveedor
    auth: {
        user: process.env.EMAIL_USER, // El correo electrónico desde el cual se enviarán los correos
        pass: process.env.EMAIL_PASSWORD, // Contraseña del correo o app password
    },
});
const axios_1 = __importDefault(require("axios"));
const BASE_URL = 'https://tu-backend-api.com';
/**
 * Enviar una notificación.
 * @param message - Mensaje de notificación a enviar.
 * @param notifyBy - Medio de notificación (correo, SMS, etc.).
 * @returns Un objeto con el mensaje de éxito o error.
 */
const sendNotification = async (message, notifyBy) => {
    var _a, _b;
    try {
        const response = await axios_1.default.post(`${BASE_URL}/notifications`, { message, notifyBy });
        // Asegurarte de que siempre retornes un objeto con el campo 'message'
        return { message: response.data.message || 'Notification sent successfully!' };
    }
    catch (error) {
        // En caso de error, retorna un objeto con el mensaje de error
        return { message: ((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Error al enviar la notificación.' };
    }
};
exports.sendNotification = sendNotification;
