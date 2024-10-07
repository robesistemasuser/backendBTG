"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFundsController = exports.updateUserFund = exports.activateUserFund = exports.deactivateUserFund = exports.deleteUserFund = exports.createUserFund = void 0;
const userFundsServices_1 = require("../services/userFundsServices");
// Controlador para crear una relación entre un usuario y un fondo
const createUserFund = async (req, res) => {
    const userFundData = req.body;
    try {
        const userFunds = Object.assign({ createdAt: new Date().toISOString(), subscriptionDate: new Date().toISOString() }, userFundData);
        const result = await (0, userFundsServices_1.createUserFundRelation)(userFundData);
        res.status(result.statusCode).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al crear la relación usuario-fondo', error: error.message });
    }
};
exports.createUserFund = createUserFund;
// Controlador para eliminar una relación entre un usuario y un fondo
const deleteUserFund = async (req, res) => {
    const { userId, fundId } = req.params;
    try {
        await (0, userFundsServices_1.deleteUserFundRelation)(userId, fundId);
        res.status(200).json({ message: 'Relación usuario-fondo eliminada exitosamente' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al eliminar la relación usuario-fondo', error: error.message });
    }
};
exports.deleteUserFund = deleteUserFund;
// Controlador para desactivar una relación entre un usuario y un fondo
const deactivateUserFund = async (req, res) => {
    const { userId, fundId } = req.params;
    try {
        await (0, userFundsServices_1.deactivateUserFundRelation)(userId, fundId);
        res.status(200).json({ message: 'Relación usuario-fondo desactivada exitosamente' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al desactivar la relación usuario-fondo', error: error.message });
    }
};
exports.deactivateUserFund = deactivateUserFund;
// Controlador para activar una relación entre un usuario y un fondo
const activateUserFund = async (req, res) => {
    const { userId, fundId } = req.params;
    try {
        await (0, userFundsServices_1.activateUserFundRelation)(userId, fundId);
        res.status(200).json({ message: 'Relación usuario-fondo activada exitosamente' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al activar la relación usuario-fondo', error: error.message });
    }
};
exports.activateUserFund = activateUserFund;
// Controlador para actualizar una relación entre un usuario y un fondo
const updateUserFund = async (req, res) => {
    const { userId, fundId } = req.params;
    const updates = req.body;
    try {
        await (0, userFundsServices_1.updateUserFundRelation)(userId, fundId, updates);
        res.status(200).json({ message: 'Relación usuario-fondo actualizada exitosamente' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al actualizar la relación usuario-fondo', error: error.message });
    }
};
exports.updateUserFund = updateUserFund;
// Controlador para obtener todas las relaciones de fondos de un usuario
const getUserFundsController = async (req, res) => {
    const { userId } = req.params;
    try {
        const userFunds = await (0, userFundsServices_1.getUserFunds)(userId);
        res.status(200).json(userFunds);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener las relaciones usuario-fondo', error: error.message });
    }
};
exports.getUserFundsController = getUserFundsController;
