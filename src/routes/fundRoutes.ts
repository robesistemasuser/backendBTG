import { Router } from 'express';
import { createFund, getFundsByFundId, listFunds, removeFund } from '../controllers/fundController';
import { body } from 'express-validator';
const router = Router();


/**
 * @swagger
 * /funds:
 *   post:
 *     summary: Create a new fund
 *     tags: [Funds]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               minAmount:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Fund created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Error creating fund
 */
router.post(
  '/',
  [
    // Validaciones
    body('name').isString().notEmpty(),
    body('minAmount').isNumeric().isFloat({ gt: 0 }), // Asegúrate de que sea un número positivo
    body('category').isString().notEmpty(),
  ],
  createFund // Asocia el controlador 'createFund' para crear un fondo
);

/**
 * @swagger
 * /funds/{id}:
 *   delete:
 *     summary: Remove a fund by ID
 *     tags: [Funds]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Fund ID to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fund removed
 *       404:
 *         description: Fund not found
 *       500:
 *         description: Error removing fund
 */
router.delete('/:id', removeFund);  // Asocia el controlador 'removeFund' para eliminar un fondo

/**
 * @swagger
 * /funds:
 *   get:
 *     summary: Get all funds
 *     tags: [Funds]
 *     responses:
 *       200:
 *         description: List of funds
 *       500:
 *         description: Error fetching funds
 */
router.get('/', listFunds);  // Asocia el controlador 'listFunds' para listar los fondos

/**
 * @swagger
 * /funds/{fundId}:
 *   get:
 *     summary: Get fund by fundId
 *     tags: [Funds]
 *     parameters:
 *       - in: path
 *         name: fundId
 *         required: true
 *         description: ID of the fund to get 
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fund 
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   fundId:
 *                     type: string
 *                     description: "ID of the fund"
 *                   amount:
 *                     type: number
 *                     description: "Amount of the transaction"
 *                   subscriptionDate:
 *                     type: string
 *                     format: "date-time"
 *                     description: "Subscription date"
 *                   transactionType:
 *                     type: string
 *                     description: "Type of transaction (e.g., 'subscribe', 'cancel')"
 *       404:
 *         description: No transactions found for the fund
 *       500:
 *         description: Error fetching transactions
 */
router.get('/:id', getFundsByFundId);  // Ruta actualizada para obtener las transacciones por fundId


export default router;
