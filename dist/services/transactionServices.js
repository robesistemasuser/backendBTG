"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionsByDocument = exports.getTransactionsByUser = exports.registerTransaction = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const database_1 = require("../config/database");
const uuid_1 = require("uuid");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const TABLE_NAME = 'transaction';
const removeUndefinedProperties = (item) => {
    const cleanedItem = {};
    for (const key in item) {
        if (item[key] !== undefined) {
            cleanedItem[key] = item[key];
        }
    }
    return cleanedItem;
};
// Función para registrar una transacción en DynamoDB
const registerTransaction = async (transactionData) => {
    const newFund = Object.assign({ transactionId: (0, uuid_1.v4)().toString(), transactionDate: new Date().toISOString() }, transactionData);
    try {
        const dbClient = (0, database_1.connectDB)();
        const item = newFund;
        const validateItem = (item) => {
            if (typeof item.transactionId !== 'string')
                throw new Error('transactionId debe ser un string');
            if (typeof item.userId !== 'string')
                throw new Error('userId debe ser un string');
            if (typeof item.fundId !== 'string')
                throw new Error('fundId debe ser un string');
            if (typeof item.documento !== 'string')
                throw new Error('documento debe ser un string');
            if (typeof item.transactionType !== 'string')
                throw new Error('transactionType debe ser un string');
            if (typeof item.amount !== 'number')
                throw new Error('amount debe ser un número');
            if (typeof item.transactionDate !== 'string')
                throw new Error('transactionDate debe ser un string');
        };
        // Antes de enviar el item, valida
        validateItem(item);
        await dbClient.send(new lib_dynamodb_1.PutCommand({
            TableName: TABLE_NAME,
            Item: item,
        }));
        console.log('Transacción registrada exitosamente');
        return newFund;
    }
    catch (error) {
        console.error('Error al registrar la transacción:', error);
        throw new Error(`Hubo un problema al registrar la transacción: ${error.message || 'Error desconocido'}`);
    }
};
exports.registerTransaction = registerTransaction;
// Función para obtener todas las transacciones de un usuario por userId utilizando un índice secundario
const getTransactionsByUser = async (userId) => {
    if (!userId) {
        throw new Error('Fund  userId are required ');
    }
    try {
        const dbClient = (0, database_1.connectDB)();
        const result = await dbClient.send(new client_dynamodb_1.QueryCommand({
            TableName: TABLE_NAME,
            IndexName: 'UserIdIndex', // Especificar el nombre del índice secundario si aplica
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': { S: userId },
            },
        }));
        return result.Items || [];
    }
    catch (error) {
        console.error('Error fetching transactions:', error);
        throw new Error('Could not fetch transactions.');
    }
};
exports.getTransactionsByUser = getTransactionsByUser;
// Función para obtener todas las transacciones de un usuario por documento
const getTransactionsByDocument = async (documento) => {
    const dbClient = (0, database_1.connectDB)();
    const result = await dbClient.send(new client_dynamodb_1.QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'documento-index', // Aquí indicamos el índice secundario global
        KeyConditionExpression: 'documento = :documento',
        ExpressionAttributeValues: {
            ':documento': { S: documento },
        },
    }));
    return result.Items;
};
exports.getTransactionsByDocument = getTransactionsByDocument;
