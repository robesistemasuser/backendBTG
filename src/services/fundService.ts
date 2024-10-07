import { connectDB } from '../config/database';
import { Fund, fundToDynamoDBItem } from '../models/fund';
import { v4 as uuidv4 } from 'uuid';
import { PutCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { AttributeValue, QueryCommand } from '@aws-sdk/client-dynamodb';

const TABLE_NAME = 'funds'; // Nombre de la tabla en DynamoDB

const removeUndefinedProperties = (item: Record<string, AttributeValue>): Record<string, AttributeValue> => {
  const cleanedItem: Record<string, AttributeValue> = {};
  
  for (const key in item) {
    if (item[key] !== undefined) {
      cleanedItem[key] = item[key];
    }
  }
  
  return cleanedItem;
};

export const subscribeFund = async (fundData: Omit<Fund, 'id' | 'createdAt'>): Promise<Fund> => {
  const newFund: Fund = {
    id: uuidv4(), // Genera un ID único para el fondo
    createdAt: new Date().toISOString(), // Agrega la fecha de creación
    ...fundData,
  };

  // Validación de propiedades de fundData
  if (!newFund.name || !newFund.minAmount || !newFund.category) {
    throw new Error('Missing required fund fields: name, minAmount, or category');
  }

  try {
    // Conexión a DynamoDB y uso de PutCommand
    const dbClient = connectDB();
    const item = newFund

  

    await dbClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
      // Agregar las opciones aquí si es necesario
    }));

    return newFund; // Devuelve el nuevo fondo creado
  } catch (error) {
    // Manejo de errores
    console.error('Error subscribing to fund:', error); // Imprimir el error completo para más contexto
    throw new Error(`Failed to subscribe to the fund: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};


// Función para eliminar un fondo
export const cancelFund = async (id: string): Promise<string> => {
  if (!id) {
    throw new Error('Fund  ID are required for canceling the subscription');
  }

  try {
    // Eliminar el fondo en DynamoDB
    await connectDB().send(new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { id },  
    }));

    return `Subscription for fund ${id} canceled successfully`;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error canceling fund:', error.message);
      throw new Error(`Failed to delete the fund ${id}: ${error.message}`);
    } else {
      console.error('Unexpected error canceling fund:', error);
      throw new Error('Failed to delete the fund due to an unexpected error.');
    }
  }
};

export const getFunds = async (): Promise<Fund[]> => {
  try {
    const result = await connectDB().send(new ScanCommand({
      TableName: TABLE_NAME,
    }));

   

    if (!result.Items) {
      return []; // Si no hay Items, retornar un arreglo vacío
    }

    return result.Items as Fund[]
    
  } catch (error) {
    // Manejo de errores
    if (error instanceof Error) {
      console.error('Error fetching funds:', error.message);
      throw new Error(`Failed to fetch funds: ${error.message}`);
    } else {
      console.error('Unexpected error fetching funds:', error);
      throw new Error('Failed to fetch funds due to an unexpected error.');
    }
  }
};

export const getFundsId = async (id: string) => {

  if (!id) {
    throw new Error('Fund  userId are required ');
  }
  
  try {
    const dbClient = connectDB();
    const result = await dbClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'FundId-index',  // Especificar el nombre del índice secundario si aplica
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':id': { S: id },
      },
    }));

    return result.Items || [];
  } catch (error) {
    console.error('Error fetching fund:', error);
    throw new Error('Could not fetch fund.');
  }
};