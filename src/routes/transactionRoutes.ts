import { Router } from 'express';
import {
  createTransaction,
  getTransactionsByUserId,
  getTransactionsByDocumento,
} from '../controllers/transactionController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: API para manejar transacciones
 */

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Crear una transacción
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "user123"
 *               fundId:
 *                 type: string
 *                 example: "fund456"
 *               documento:
 *                 type: string
 *                 example: "12345678"
 *               amount:
 *                 type: number
 *                 example: 100.50
 *               transactionType:
 *                 type: string
 *                 enum: [subscribe, unsubscribe]
 *                 example: "subscribe"
 *     responses:
 *       201:
 *         description: Transacción creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 transactionId:
 *                   type: string
 *       500:
 *         description: Error al registrar la transacción
 *
 * /transactions/user/{userId}:
 *   get:
 *     summary: Obtener transacciones por userId
 *     tags: [Transactions]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: string
 *           example: "user123"
 *     responses:
 *       200:
 *         description: Lista de transacciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: No se encontraron transacciones
 *       500:
 *         description: Error al obtener las transacciones
 *
 * /transactions/document/{documento}:
 *   get:
 *     summary: Obtener transacciones por documento
 *     tags: [Transactions]
 *     parameters:
 *       - name: documento
 *         in: path
 *         required: true
 *         description: Número de documento
 *         schema:
 *           type: string
 *           example: "12345678"
 *     responses:
 *       200:
 *         description: Lista de transacciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: No se encontraron transacciones
 *       500:
 *         description: Error al obtener las transacciones
 */

router.post('/', createTransaction);
router.get('/user/:userId', getTransactionsByUserId);
router.get('/document/:documento', getTransactionsByDocumento);

export default router;
