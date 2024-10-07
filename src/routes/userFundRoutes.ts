import express from 'express';
import { 
  createUserFund, 
  deleteUserFund, 
  deactivateUserFund, 
  activateUserFund, 
  updateUserFund, 
  getUserFundsController 
} from '../controllers/userFundsController';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     UserFunds:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: ID del usuario.
 *         fundId:
 *           type: string
 *           description: ID del fondo.
 *         transactionType:
 *           type: string
 *           description: Tipo de transacción (por ejemplo, "subscribe" o "unsubscribe").
 *         amount:
 *           type: number
 *           description: Monto de la transacción.
 *         active:
 *           type: boolean
 *           description: Estado de la relación.
 *       example:
 *         userId: "user123"
 *         fundId: "fund456"
 *         transactionType: "subscribe"
 *         amount: 100.50
 *         active: true
 */

/**
 * @swagger
 * /userfunds:
 *   post:
 *     summary: Crear una relación entre un usuario y un fondo
 *     tags: [UserFunds]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserFunds'
 *     responses:
 *       201:
 *         description: Relación usuario-fondo creada exitosamente.
 *       500:
 *         description: Error al crear la relación usuario-fondo.
 */
router.post('/', createUserFund);

/**
 * @swagger
 * /userfunds/{userId}/{fundId}:
 *   delete:
 *     summary: Eliminar una relación entre un usuario y un fondo
 *     tags: [UserFunds]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario.
 *       - in: path
 *         name: fundId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del fondo.
 *     responses:
 *       200:
 *         description: Relación usuario-fondo eliminada exitosamente.
 *       500:
 *         description: Error al eliminar la relación usuario-fondo.
 */
router.delete('/:userId/:fundId', deleteUserFund);

/**
 * @swagger
 * /userfunds/deactivate/{userId}/{fundId}:
 *   patch:
 *     summary: Desactivar una relación entre un usuario y un fondo
 *     tags: [UserFunds]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario.
 *       - in: path
 *         name: fundId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del fondo.
 *     responses:
 *       200:
 *         description: Relación usuario-fondo desactivada exitosamente.
 *       500:
 *         description: Error al desactivar la relación usuario-fondo.
 */
router.patch('/deactivate/:userId/:fundId', deactivateUserFund);

/**
 * @swagger
 * /userfunds/activate/{userId}/{fundId}:
 *   patch:
 *     summary: Activar una relación entre un usuario y un fondo
 *     tags: [UserFunds]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario.
 *       - in: path
 *         name: fundId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del fondo.
 *     responses:
 *       200:
 *         description: Relación usuario-fondo activada exitosamente.
 *       500:
 *         description: Error al activar la relación usuario-fondo.
 */
router.patch('/activate/:userId/:fundId', activateUserFund);

/**
 * @swagger
 * /userfunds/{userId}/{fundId}:
 *   put:
 *     summary: Actualizar una relación entre un usuario y un fondo
 *     tags: [UserFunds]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario.
 *       - in: path
 *         name: fundId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del fondo.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserFunds'
 *     responses:
 *       200:
 *         description: Relación usuario-fondo actualizada exitosamente.
 *       500:
 *         description: Error al actualizar la relación usuario-fondo.
 */
router.put('/userfunds/:userId/:fundId', updateUserFund);

/**
 * @swagger
 * /userfunds/{userId}:
 *   get:
 *     summary: Obtener todas las relaciones de fondos de un usuario
 *     tags: [UserFunds]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario.
 *     responses:
 *       200:
 *         description: Lista de relaciones usuario-fondo obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserFunds'
 *       500:
 *         description: Error al obtener las relaciones usuario-fondo.
 */
router.get('/:userId', getUserFundsController);

export default router;
