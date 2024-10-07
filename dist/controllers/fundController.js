"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFundsByFundId = exports.removeFund = exports.listFunds = exports.createFund = void 0;
const uuid_1 = require("uuid");
const fundService_1 = require("../services/fundService");
// Controlador para crear un fondo
const createFund = async (req, res) => {
    try {
        // Generar un nuevo UUID para el fondo
        const fundData = Object.assign(Object.assign({}, req.body), { id: (0, uuid_1.v4)() });
        const newFund = await (0, fundService_1.subscribeFund)(fundData); // Llama al servicio para suscribir al fondo
        res.status(201).json(newFund); // Devuelve el fondo creado
    }
    catch (error) {
        handleError(res, error, 'creating the fund');
    }
};
exports.createFund = createFund;
// Controlador para listar todos los fondos
const listFunds = async (req, res) => {
    try {
        const funds = await (0, fundService_1.getFunds)(); // Llama al servicio para obtener todos los fondos
        res.status(200).json(funds); // Devuelve la lista de fondos
    }
    catch (error) {
        handleError(res, error, 'fetching the funds');
    }
};
exports.listFunds = listFunds;
// Controlador para eliminar un fondo
const removeFund = async (req, res) => {
    const { id } = req.params; // Obtiene el ID del fondo de los parámetros de la ruta
    try {
        await (0, fundService_1.cancelFund)(id); // Llama al servicio para cancelar el fondo
        res.status(200).json({ message: `Fund with ID ${id} deleted successfully` });
    }
    catch (error) {
        handleError(res, error, 'deleting the fund');
    }
};
exports.removeFund = removeFund;
// Función reutilizable para manejar errores
const handleError = (res, error, action) => {
    if (error instanceof Error) {
        res.status(500).json({ message: `Error ${action}: ${error.message}` });
    }
    else {
        res.status(500).json({ message: `Unexpected error occurred while ${action}` });
    }
};
// Controlador para obtener fondo por fundId
const getFundsByFundId = async (req, res) => {
    try {
        const { id } = req.params;
        const funds = await (0, fundService_1.getFundsId)(id);
        if (!funds || funds.length === 0) {
            res.status(404).json({ message: 'No se encontro fondo para este usuario' });
        }
        else {
            res.status(200).json(funds);
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener el fondo', error: error.message });
    }
};
exports.getFundsByFundId = getFundsByFundId;
