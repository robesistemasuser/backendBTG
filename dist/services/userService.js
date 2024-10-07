"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByDocument = exports.getAllUsers = exports.deleteUser = exports.updateUser = exports.getUserById = exports.addUser = void 0;
const uuid_1 = require("uuid");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const database_1 = require("../config/database");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const TABLE_NAME = 'users';
const removeUndefinedProperties = (item) => {
    const cleanedItem = {};
    for (const key in item) {
        if (item[key] !== undefined) {
            cleanedItem[key] = item[key];
        }
    }
    return cleanedItem;
};
// Función para agregar un usuario
const addUser = async (userData) => {
    const newFund = Object.assign({ id: (0, uuid_1.v4)(), createdAt: new Date().toISOString() }, userData);
    try {
        const dbClient = (0, database_1.connectDB)();
        const item = newFund;
        await dbClient.send(new lib_dynamodb_1.PutCommand({
            TableName: TABLE_NAME,
            Item: item,
        }));
        return newFund;
    }
    catch (error) {
        console.error('Error subscribing to fund:', error);
        throw new Error(`Failed to subscribe to the fund: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
exports.addUser = addUser;
// Función para obtener un usuario por ID
const getUserById = async (id) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const result = await (0, database_1.connectDB)().send(new client_dynamodb_1.GetItemCommand({
        TableName: 'users',
        Key: {
            id: { S: id },
        },
    }));
    // Aquí se asegura que si un campo está indefinido, se le asigna un valor por defecto
    return result.Item ? {
        id: (_b = (_a = result.Item.id) === null || _a === void 0 ? void 0 : _a.S) !== null && _b !== void 0 ? _b : '', // Si el valor es undefined, se asigna una cadena vacía
        name: (_d = (_c = result.Item.name) === null || _c === void 0 ? void 0 : _c.S) !== null && _d !== void 0 ? _d : '',
        documento: (_f = (_e = result.Item.documento) === null || _e === void 0 ? void 0 : _e.S) !== null && _f !== void 0 ? _f : '',
        email: (_h = (_g = result.Item.email) === null || _g === void 0 ? void 0 : _g.S) !== null && _h !== void 0 ? _h : '',
        balance: Number((_k = (_j = result.Item.balance) === null || _j === void 0 ? void 0 : _j.N) !== null && _k !== void 0 ? _k : 0), // Si es undefined, se asigna 0
        createdAt: (_m = (_l = result.Item.createdAt) === null || _l === void 0 ? void 0 : _l.S) !== null && _m !== void 0 ? _m : '',
    } : null;
};
exports.getUserById = getUserById;
// Función para actualizar un usuario
const updateUser = async (id, updatedData) => {
    const updateExpression = Object.keys(updatedData)
        .map((key, index) => `${key} = :value${index}`)
        .join(', ');
    const expressionAttributeValues = Object.keys(updatedData).reduce((acc, key, index) => {
        const typedKey = key;
        if (typeof updatedData[typedKey] === 'string') {
            acc[`:value${index}`] = { S: updatedData[typedKey] };
        }
        else if (typeof updatedData[typedKey] === 'number') {
            acc[`:value${index}`] = { N: updatedData[typedKey].toString() };
        }
        return acc;
    }, {});
    await (0, database_1.connectDB)().send(new client_dynamodb_1.UpdateItemCommand({
        TableName: 'users',
        Key: {
            id: { S: id },
        },
        UpdateExpression: `SET ${updateExpression}`,
        ExpressionAttributeValues: expressionAttributeValues,
    }));
    return await (0, exports.getUserById)(id);
};
exports.updateUser = updateUser;
// Función para eliminar un usuario
const deleteUser = async (id) => {
    const result = await (0, database_1.connectDB)().send(new client_dynamodb_1.DeleteItemCommand({
        TableName: 'users',
        Key: {
            id: { S: id },
        },
    }));
    return result.Attributes ? true : false;
};
exports.deleteUser = deleteUser;
// Función para obtener todos los usuarios
const getAllUsers = async () => {
    var _a;
    const dbClient = (0, database_1.connectDB)();
    const result = await dbClient.send(new client_dynamodb_1.ScanCommand({
        TableName: TABLE_NAME,
    }));
    // Mapear los resultados a objetos de tipo User
    return ((_a = result.Items) === null || _a === void 0 ? void 0 : _a.map(item => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return ({
            id: (_b = (_a = item.id) === null || _a === void 0 ? void 0 : _a.S) !== null && _b !== void 0 ? _b : '', // Manejo de valores indefinidos
            name: (_d = (_c = item.name) === null || _c === void 0 ? void 0 : _c.S) !== null && _d !== void 0 ? _d : '',
            documento: (_f = (_e = item.documento) === null || _e === void 0 ? void 0 : _e.S) !== null && _f !== void 0 ? _f : '',
            email: (_h = (_g = item.email) === null || _g === void 0 ? void 0 : _g.S) !== null && _h !== void 0 ? _h : '',
            balance: Number((_k = (_j = item.balance) === null || _j === void 0 ? void 0 : _j.N) !== null && _k !== void 0 ? _k : 0),
            createdAt: (_m = (_l = item.createdAt) === null || _l === void 0 ? void 0 : _l.S) !== null && _m !== void 0 ? _m : '',
        });
    })) || [];
};
exports.getAllUsers = getAllUsers;
// Función para obtener un usuario por documento
const getUserByDocument = async (documento) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    const dbClient = (0, database_1.connectDB)();
    const result = await dbClient.send(new client_dynamodb_1.QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'documento-index',
        KeyConditionExpression: 'documento = :documento',
        ExpressionAttributeValues: {
            ':documento': { S: documento },
        },
    }));
    if ((_a = result.Items) === null || _a === void 0 ? void 0 : _a.length) {
        const item = result.Items[0];
        return {
            id: (_c = (_b = item.id) === null || _b === void 0 ? void 0 : _b.S) !== null && _c !== void 0 ? _c : '', // Manejo de valores indefinidos
            name: (_e = (_d = item.name) === null || _d === void 0 ? void 0 : _d.S) !== null && _e !== void 0 ? _e : '',
            documento: (_g = (_f = item.documento) === null || _f === void 0 ? void 0 : _f.S) !== null && _g !== void 0 ? _g : '',
            email: (_j = (_h = item.email) === null || _h === void 0 ? void 0 : _h.S) !== null && _j !== void 0 ? _j : '',
            balance: Number((_l = (_k = item.balance) === null || _k === void 0 ? void 0 : _k.N) !== null && _l !== void 0 ? _l : 0),
            createdAt: (_o = (_m = item.createdAt) === null || _m === void 0 ? void 0 : _m.S) !== null && _o !== void 0 ? _o : '',
        };
    }
    return null;
};
exports.getUserByDocument = getUserByDocument;
