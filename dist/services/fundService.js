"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFundsId = exports.getFunds = exports.cancelFund = exports.subscribeFund = void 0;
const database_1 = require("../config/database");
const uuid_1 = require("uuid");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const TABLE_NAME = 'funds'; // Nombre de la tabla en DynamoDB
const removeUndefinedProperties = (item) => {
    const cleanedItem = {};
    for (const key in item) {
        if (item[key] !== undefined) {
            cleanedItem[key] = item[key];
        }
    }
    return cleanedItem;
};
const subscribeFund = async (fundData) => {
    const newFund = Object.assign({ id: (0, uuid_1.v4)(), createdAt: new Date().toISOString() }, fundData);
    // Validación de propiedades de fundData
    if (!newFund.name || !newFund.minAmount || !newFund.category) {
        throw new Error('Missing required fund fields: name, minAmount, or category');
    }
    try {
        // Conexión a DynamoDB y uso de PutCommand
        const dbClient = (0, database_1.connectDB)();
        const item = newFund;
        await dbClient.send(new lib_dynamodb_1.PutCommand({
            TableName: TABLE_NAME,
            Item: item,
            // Agregar las opciones aquí si es necesario
        }));
        return newFund; // Devuelve el nuevo fondo creado
    }
    catch (error) {
        // Manejo de errores
        console.error('Error subscribing to fund:', error); // Imprimir el error completo para más contexto
        throw new Error(`Failed to subscribe to the fund: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
exports.subscribeFund = subscribeFund;
// Función para eliminar un fondo
const cancelFund = async (id) => {
    if (!id) {
        throw new Error('Fund  ID are required for canceling the subscription');
    }
    try {
        // Eliminar el fondo en DynamoDB
        await (0, database_1.connectDB)().send(new lib_dynamodb_1.DeleteCommand({
            TableName: TABLE_NAME,
            Key: { id },
        }));
        return `Subscription for fund ${id} canceled successfully`;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error canceling fund:', error.message);
            throw new Error(`Failed to delete the fund ${id}: ${error.message}`);
        }
        else {
            console.error('Unexpected error canceling fund:', error);
            throw new Error('Failed to delete the fund due to an unexpected error.');
        }
    }
};
exports.cancelFund = cancelFund;
const getFunds = async () => {
    try {
        const result = await (0, database_1.connectDB)().send(new lib_dynamodb_1.ScanCommand({
            TableName: TABLE_NAME,
        }));
        if (!result.Items) {
            return []; // Si no hay Items, retornar un arreglo vacío
        }
        return result.Items;
    }
    catch (error) {
        // Manejo de errores
        if (error instanceof Error) {
            console.error('Error fetching funds:', error.message);
            throw new Error(`Failed to fetch funds: ${error.message}`);
        }
        else {
            console.error('Unexpected error fetching funds:', error);
            throw new Error('Failed to fetch funds due to an unexpected error.');
        }
    }
};
exports.getFunds = getFunds;
const getFundsId = async (id) => {
    if (!id) {
        throw new Error('Fund  userId are required ');
    }
    try {
        const dbClient = (0, database_1.connectDB)();
        const result = await dbClient.send(new client_dynamodb_1.QueryCommand({
            TableName: TABLE_NAME,
            IndexName: 'FundId-index', // Especificar el nombre del índice secundario si aplica
            KeyConditionExpression: 'id = :id',
            ExpressionAttributeValues: {
                ':id': { S: id },
            },
        }));
        return result.Items || [];
    }
    catch (error) {
        console.error('Error fetching fund:', error);
        throw new Error('Could not fetch fund.');
    }
};
exports.getFundsId = getFundsId;
