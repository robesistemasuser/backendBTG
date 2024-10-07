"use strict";
// src/models/transactionHistory.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionHistoryToDynamoDBItem = void 0;
// Función para convertir TransactionHistory a un formato compatible con DynamoDB
const transactionHistoryToDynamoDBItem = (transaction) => {
    const item = {
        transactionId: { S: transaction.transactionId }, // 'S' indica que es un string
        userId: { S: transaction.userId }, // 'S' indica que es un string
        fundId: { S: transaction.fundId }, // 'S' indica que es un string
        fundName: { S: transaction.fundName }, // 'S' indica que es un string
        documento: { S: transaction.documento }, // 'S' indica que es un string
        transactionType: { S: transaction.transactionType }, // 'S' indica que es un string
        amount: { N: transaction.amount.toString() }, // 'N' indica que es un número (convertido a string)
        transactionDate: { S: transaction.transactionDate }, // 'S' indica que es un string
    };
    return item;
};
exports.transactionHistoryToDynamoDBItem = transactionHistoryToDynamoDBItem;
