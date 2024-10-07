"use strict";
// src/models/fund.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.fundToDynamoDBItem = void 0;
// Función para convertir Fund a un formato compatible con DynamoDB
const fundToDynamoDBItem = (fund) => {
    const item = {
        id: { S: fund.id }, // 'S' indica que es un string
        name: { S: fund.name },
        minAmount: { N: fund.minAmount.toString() }, // Convertir a string para DynamoDB
        category: { S: fund.category },
        createdAt: { S: fund.createdAt },
    };
    return item;
};
exports.fundToDynamoDBItem = fundToDynamoDBItem;
