"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const userService_1 = require("../services/userService");
const router = (0, express_1.Router)();
// Configuración de Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'User API',
            version: '1.0.0',
            description: 'API para gestionar usuarios',
        },
        servers: [
            {
                url: 'http://localhost:3010', // Cambiar según tu URL
            },
        ],
    },
    apis: ['./src/routes/userRoutes.ts'], // Ruta donde están las definiciones
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
// Ruta para la documentación de Swagger
router.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Juan Pérez"
 *               email:
 *                 type: string
 *                 example: "juan.perez@example.com"
 *               balance:
 *                 type: number
 *                 example: 100.0
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       500:
 *         description: Error al registrar el usuario
 */
router.post('/', async (req, res) => {
    try {
        const user = await (0, userService_1.addUser)(req.body);
        res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al registrar el usuario', error });
    }
});
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   balance:
 *                     type: number
 *                   createdAt:
 *                     type: string
 *       500:
 *         description: Error al obtener la lista de usuarios
 */
router.get('/', async (req, res) => {
    try {
        const users = await (0, userService_1.getAllUsers)(); // Obtener todos los usuarios
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener la lista de usuarios', error });
    }
});
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario que se desea obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 balance:
 *                   type: number
 *                 createdAt:
 *                   type: string
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al obtener el usuario
 */
router.get('/:id', async (req, res) => {
    try {
        const user = await (0, userService_1.getUserById)(req.params.id);
        if (user) {
            res.status(200).json(user);
        }
        else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario', error });
    }
});
/**
 * @swagger
 * /users/documento/{documento}:
 *   get:
 *     summary: Obtiene un usuario por documento
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: documento
 *         required: true
 *         description: Documento del usuario que se desea obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 balance:
 *                   type: number
 *                 createdAt:
 *                   type: string
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al obtener el usuario
 */
router.get('/documento/:documento', async (req, res) => {
    try {
        const user = await (0, userService_1.getUserByDocument)(req.params.documento);
        if (user) {
            res.status(200).json(user);
        }
        else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario', error });
    }
});
exports.default = router;
