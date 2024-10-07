"use strict";
// src/models/user.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.userToDynamoDBItem = void 0;
// Función para convertir User a un formato compatible con DynamoDB
const userToDynamoDBItem = (user) => {
    const item = {
        id: { S: user.id }, // 'S' indica que es un string
        name: { S: user.name },
        documento: { S: user.documento },
        email: { S: user.email },
        balance: { N: user.balance.toString() }, // Convertir balance a string para DynamoDB
        createdAt: { S: user.createdAt }, // 'S' indica que es un string
    };
    return item;
};
exports.userToDynamoDBItem = userToDynamoDBItem;
