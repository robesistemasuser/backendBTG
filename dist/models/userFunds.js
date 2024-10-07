"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFundsToDynamoDBItem = void 0;
// Función para convertir UserFunds a un formato compatible con DynamoDB
const userFundsToDynamoDBItem = (userFunds) => {
    const item = {
        userId: { S: userFunds.userId }, // String
        fundId: { S: userFunds.fundId }, // String
        document: { S: userFunds.document },
        fundName: { S: userFunds.fundName },
        transactionType: { S: userFunds.transactionType }, // String
        subscriptionDate: { S: userFunds.subscriptionDate }, // String
        amount: { N: userFunds.amount.toString() }, // Number convertido a string
        active: { BOOL: userFunds.active }, // Booleano
        createdAt: { S: userFunds.createdAt }, // String
    };
    return item;
};
exports.userFundsToDynamoDBItem = userFundsToDynamoDBItem;
