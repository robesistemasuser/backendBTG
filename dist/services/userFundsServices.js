"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFunds = exports.updateUserFundRelation = exports.activateUserFundRelation = exports.deactivateUserFundRelation = exports.deleteUserFundRelation = exports.createUserFundRelation = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const database_1 = require("../config/database");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const transactionServices_1 = require("./transactionServices");
const TABLE_NAME = 'userfunds';
// Función para crear o actualizar una relación entre un usuario y un fondo
const createUserFundRelation = async (userFundData) => {
    try {
        const dbClient = (0, database_1.connectDB)(); // Conectar a DynamoDB
        // Verificar si ya existe la relación entre el usuario y el fondo
        const existingFund = await dbClient.send(new lib_dynamodb_1.GetCommand({
            TableName: TABLE_NAME,
            Key: {
                userId: userFundData.userId,
                fundId: userFundData.fundId,
            },
        }));
        if (existingFund.Item) {
            return {
                statusCode: 200,
                message: `La relación entre el usuario y el fondo ya existe.`,
            };
        }
        else {
            // Validar que el documento del usuario pertenece al userId
            const userValidation = await dbClient.send(new lib_dynamodb_1.GetCommand({
                TableName: 'users', // Tabla donde se almacenan los usuarios
                Key: { id: userFundData.userId }, // Consulta para validar el documento del usuario
            }));
            // Verificar que el documento del usuario coincida
            if (!userValidation.Item || userValidation.Item.documento !== userFundData.document) {
                return {
                    statusCode: 400, // Código de estado para solicitudes incorrectas
                    message: 'El documento proporcionado no pertenece al usuario indicado.',
                };
            }
            // Consultar el fondo para obtener el minAmount
            const fundValidation = await dbClient.send(new lib_dynamodb_1.GetCommand({
                TableName: 'funds', // Tabla donde se almacenan los fondos
                Key: { id: userFundData.fundId }, // Consulta para obtener los detalles del fondo
            }));
            // Verificar si el fondo existe
            if (!fundValidation.Item) {
                return {
                    statusCode: 404,
                    message: `El fondo con ID ${userFundData.fundId} no existe.`,
                };
            }
            const minAmount = fundValidation.Item.minAmount;
            // Validar que el monto ingresado sea menor o igual al minAmount del fondo
            if (userFundData.amount < minAmount) {
                return {
                    statusCode: 400, // Código de error por monto no válido
                    message: `El monto ingresado (${userFundData.amount}) no cumple con el monto mínimo permitido (${minAmount}) para el fondo ${fundValidation.Item.name}.`,
                };
            }
            const newFund = Object.assign({ createdAt: new Date().toISOString(), subscriptionDate: new Date().toISOString() }, userFundData);
            // Insertar la nueva relación en DynamoDB
            await dbClient.send(new lib_dynamodb_1.PutCommand({
                TableName: TABLE_NAME,
                Item: newFund,
            }));
            // Llamar al servicio para registrar la transacción después de crear
            await (0, transactionServices_1.registerTransaction)({
                userId: userFundData.userId,
                fundId: userFundData.fundId,
                fundName: userFundData.fundName,
                transactionType: userFundData.transactionType,
                amount: userFundData.amount,
                documento: userFundData.document,
            });
            // Retornar mensaje de éxito con los datos de la nueva relación
            return {
                statusCode: 201,
                message: 'Relación usuario-fondo creada exitosamente.',
                data: newFund, // Devuelve los datos del nuevo fondo creado
            };
        }
    }
    catch (error) {
        // Manejo de errores, retornar un código de error y mensaje
        console.error('Error al crear la relación usuario-fondo:', error);
        return {
            statusCode: 500,
            message: `Error al crear o actualizar la relación: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
    }
};
exports.createUserFundRelation = createUserFundRelation;
// Función para eliminar una relación entre un usuario y un fondo
const deleteUserFundRelation = async (userId, fundId) => {
    const dbClient = (0, database_1.connectDB)();
    await dbClient.send(new client_dynamodb_1.DeleteItemCommand({
        TableName: TABLE_NAME,
        Key: {
            userId: { S: userId },
            fundId: { S: fundId },
        },
    }));
};
exports.deleteUserFundRelation = deleteUserFundRelation;
// Función para desactivar una relación (no eliminarla)
const deactivateUserFundRelation = async (userId, fundId) => {
    const dbClient = (0, database_1.connectDB)();
    await dbClient.send(new client_dynamodb_1.UpdateItemCommand({
        TableName: TABLE_NAME,
        Key: {
            userId: { S: userId },
            fundId: { S: fundId },
        },
        UpdateExpression: 'SET #status = :status',
        ExpressionAttributeNames: {
            '#status': 'status',
        },
        ExpressionAttributeValues: {
            ':status': { S: 'inactive' },
        },
    }));
};
exports.deactivateUserFundRelation = deactivateUserFundRelation;
// Función para activar una relación
const activateUserFundRelation = async (userId, fundId) => {
    const dbClient = (0, database_1.connectDB)();
    await dbClient.send(new client_dynamodb_1.UpdateItemCommand({
        TableName: TABLE_NAME,
        Key: {
            userId: { S: userId },
            fundId: { S: fundId },
        },
        UpdateExpression: 'SET #status = :status',
        ExpressionAttributeNames: {
            '#status': 'status',
        },
        ExpressionAttributeValues: {
            ':status': { S: 'active' },
        },
    }));
};
exports.activateUserFundRelation = activateUserFundRelation;
// Función para actualizar la relación (cambiar algún atributo)
const updateUserFundRelation = async (userId, fundId, updates) => {
    var _a, _b, _c, _d, _e;
    const dbClient = (0, database_1.connectDB)();
    const updateExpressions = [];
    const expressionAttributeValues = {};
    // Actualización de active (opcional)
    if (typeof updates.active === 'boolean') {
        updateExpressions.push('#active = :active');
        expressionAttributeValues[':active'] = updates.active;
    }
    // Actualización de subscriptionDate (opcional)
    if (updates.subscriptionDate) {
        updateExpressions.push('#subscriptionDate = :subscriptionDate');
        expressionAttributeValues[':subscriptionDate'] = updates.subscriptionDate;
    }
    // Actualización de amount (opcional)
    const amount = (_a = updates.amount) !== null && _a !== void 0 ? _a : 0; // Usar 0 si no se proporciona amount
    if (amount !== undefined) {
        updateExpressions.push('#amount = :amount');
        expressionAttributeValues[':amount'] = amount;
    }
    // Actualización de transactionType (opcional)
    const transactionType = (_b = updates.transactionType) !== null && _b !== void 0 ? _b : 'subscribe'; // Valor predeterminado
    if (transactionType) {
        updateExpressions.push('#transactionType = :transactionType');
        expressionAttributeValues[':transactionType'] = transactionType;
    }
    // Verificar que se hayan proporcionado actualizaciones
    if (updateExpressions.length === 0) {
        throw new Error('No updates provided');
    }
    // Ejecutar la actualización en DynamoDB
    await dbClient.send(new client_dynamodb_1.UpdateItemCommand({
        TableName: TABLE_NAME,
        Key: {
            userId: { S: userId },
            fundId: { S: fundId },
        },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: {
            '#active': 'active',
            '#subscriptionDate': 'subscriptionDate',
            '#amount': 'amount',
            '#transactionType': 'transactionType',
        },
        ExpressionAttributeValues: expressionAttributeValues,
    }));
    console.log(`Actualización exitosa para userId: ${userId}, fundId: ${fundId}`);
    return {
        userId,
        fundId,
        document: (_c = updates.document) !== null && _c !== void 0 ? _c : '', // Asignar valor por defecto
        active: (_d = updates.active) !== null && _d !== void 0 ? _d : true,
        subscriptionDate: (_e = updates.subscriptionDate) !== null && _e !== void 0 ? _e : new Date().toISOString(),
        amount: amount,
        transactionType: transactionType,
        createdAt: new Date().toISOString(),
    };
};
exports.updateUserFundRelation = updateUserFundRelation;
// Función para obtener todas las relaciones de un usuario
const getUserFunds = async (userId) => {
    const dbClient = (0, database_1.connectDB)();
    const result = await dbClient.send(new client_dynamodb_1.QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': { S: userId },
        },
    }));
    return result.Items;
};
exports.getUserFunds = getUserFunds;
