// src/models/transactionHistory.ts

import { AttributeValue } from '@aws-sdk/client-dynamodb';

// Definición de la interfaz TransactionHistory
export interface TransactionHistory {
    transactionId: string;  // ID único de la transacción
    userId: string;         // ID del usuario que realiza la transacción
    fundId: string;         // ID del fondo relacionado con la transacción
    fundName: string;
    documento: string;      // Documento asociado a la transacción
    transactionType: 'subscribe' | 'unsubscribe'; // Tipo de transacción: suscripción o desuscripción
    amount: number;         // Monto asociado a la transacción
    transactionDate: string; // Fecha de la transacción (timestamp)
}

// Función para convertir TransactionHistory a un formato compatible con DynamoDB
export const transactionHistoryToDynamoDBItem = (transaction: TransactionHistory): Record<string, AttributeValue> => {
    const item: Record<string, AttributeValue> = {
        transactionId: { S: transaction.transactionId },            // 'S' indica que es un string
        userId: { S: transaction.userId },                          // 'S' indica que es un string
        fundId: { S: transaction.fundId },                          // 'S' indica que es un string
        fundName: { S: transaction.fundName },                   // 'S' indica que es un string
        documento: { S: transaction.documento },                   // 'S' indica que es un string
        transactionType: { S: transaction.transactionType },        // 'S' indica que es un string
        amount: { N: transaction.amount.toString() },              // 'N' indica que es un número (convertido a string)
        transactionDate: { S: transaction.transactionDate },        // 'S' indica que es un string
    };

    return item;
};
