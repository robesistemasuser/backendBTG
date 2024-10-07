"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionsByDocumento = exports.getTransactionsByUserId = exports.createTransaction = void 0;
const transactionServices_1 = require("../services/transactionServices");
const uuid_1 = require("uuid"); // Importar el generador de UUID
// Controlador para crear una transacción
const createTransaction = async (req, res) => {
    try {
        const transaction = Object.assign(Object.assign({}, req.body), { transactionId: (0, uuid_1.v4)(), transactionDate: new Date().toISOString() });
        const result = await (0, transactionServices_1.registerTransaction)(transaction);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al registrar la transacción', error: error.message });
    }
};
exports.createTransaction = createTransaction;
// Controlador para obtener transacciones por userId
const getTransactionsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const transactions = await (0, transactionServices_1.getTransactionsByUser)(userId);
        if (!transactions || transactions.length === 0) {
            res.status(404).json({ message: 'No se encontraron transacciones para este usuario' });
        }
        else {
            res.status(200).json(transactions);
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener las transacciones', error: error.message });
    }
};
exports.getTransactionsByUserId = getTransactionsByUserId;
// Controlador para obtener transacciones por documento
const getTransactionsByDocumento = async (req, res) => {
    try {
        const { documento } = req.params;
        const transactions = await (0, transactionServices_1.getTransactionsByDocument)(documento);
        if (!transactions || transactions.length === 0) {
            res.status(404).json({ message: 'No se encontraron transacciones para este documento' });
        }
        else {
            res.status(200).json(transactions);
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener las transacciones', error: error.message });
    }
};
exports.getTransactionsByDocumento = getTransactionsByDocumento;
