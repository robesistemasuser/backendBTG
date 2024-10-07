"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("../controllers/notification.controller");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: API para gestionar notificaciones
 */
/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Enviar una notificación
 *     tags: [Notifications]
 *     description: Enviar una notificación por correo o mensaje de texto.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *               - notifyBy
 *             properties:
 *               message:
 *                 type: string
 *                 description: Mensaje de la notificación
 *                 example: "Hola, esta es una notificación"
 *               notifyBy:
 *                 type: string
 *                 description: Medio de notificación (correo, SMS)
 *                 example: "email"
 *     responses:
 *       200:
 *         description: Notificación enviada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de respuesta
 *                   example: "Notification sent successfully!"
 *       400:
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detalle del error
 *                   example: "Error al enviar la notificación."
 */
// Ruta para enviar notificaciones
router.post('/notifications', notification_controller_1.sendNotificationController);
exports.default = router;
