import { AttributeValue, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { connectDB } from '../config/database';  
import { v4 as uuidv4 } from 'uuid';
import { TransactionHistory, transactionHistoryToDynamoDBItem } from '../models/transactionHistory';
import { PutCommand } from '@aws-sdk/lib-dynamodb';

const TABLE_NAME = 'transaction';

const removeUndefinedProperties = (item: Record<string, AttributeValue>): Record<string, AttributeValue> => {
  const cleanedItem: Record<string, AttributeValue> = {};
  
  for (const key in item) {
    if (item[key] !== undefined) {
      cleanedItem[key] = item[key];
    }
  }
  
  return cleanedItem;
};

// Función para registrar una transacción en DynamoDB
export const registerTransaction = async (transactionData: Omit<TransactionHistory, 'transactionId' | 'transactionDate'>): Promise<TransactionHistory> => {
  const newFund: TransactionHistory = {
      transactionId: uuidv4().toString(), // Asegúrate de que esto sea un string
      transactionDate: new Date().toISOString(),
      ...transactionData,
  };

  try {
      const dbClient = connectDB();
      const item = newFund;
      
      const validateItem = (item: any) => {
        if (typeof item.transactionId !== 'string') throw new Error('transactionId debe ser un string');
        if (typeof item.userId !== 'string') throw new Error('userId debe ser un string');
        if (typeof item.fundId !== 'string') throw new Error('fundId debe ser un string');
        if (typeof item.documento !== 'string') throw new Error('documento debe ser un string');
        if (typeof item.transactionType !== 'string') throw new Error('transactionType debe ser un string');
        if (typeof item.amount !== 'number') throw new Error('amount debe ser un número');
        if (typeof item.transactionDate !== 'string') throw new Error('transactionDate debe ser un string');
    };
    
    // Antes de enviar el item, valida
    validateItem(item);
    
     

      await dbClient.send(new PutCommand({
          TableName: TABLE_NAME,
          Item: item,
      }));

      console.log('Transacción registrada exitosamente');
      return newFund;
  } catch (error: any) {
      console.error('Error al registrar la transacción:', error);
      throw new Error(`Hubo un problema al registrar la transacción: ${error.message || 'Error desconocido'}`);
  }
};


// Función para obtener todas las transacciones de un usuario por userId utilizando un índice secundario
export const getTransactionsByUser = async (userId: string) => {

  if (!userId) {
    throw new Error('Fund  userId are required ');
  }
 

  try {
    const dbClient = connectDB();
    const result = await dbClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'UserIdIndex',  // Especificar el nombre del índice secundario si aplica
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': { S: userId },
      },
    }));

    return result.Items || [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw new Error('Could not fetch transactions.');
  }
};


// Función para obtener todas las transacciones de un usuario por documento
export const getTransactionsByDocument = async (documento: string) => {
  const dbClient = connectDB();

  const result = await dbClient.send(new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: 'documento-index', // Aquí indicamos el índice secundario global
    KeyConditionExpression: 'documento = :documento',
    ExpressionAttributeValues: {
      ':documento': { S: documento },
    },
  }));

  return result.Items;
};
