"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotificationController = void 0;
const notification_service_1 = require("../services/notification.service"); // Asegúrate de que la ruta sea la correcta
// Controlador que maneja la lógica para enviar la notificación
const sendNotificationController = async (req, res, next) => {
    try {
        const { message, notifyBy } = req.body;
        // Llamar al servicio de notificación
        const result = await (0, notification_service_1.sendNotification)(message, notifyBy);
        // Respuesta exitosa con el mensaje
        res.status(200).json({ message: result.message });
    }
    catch (error) {
        next(error); // Pasar el error al middleware de manejo de errores
    }
};
exports.sendNotificationController = sendNotificationController;
