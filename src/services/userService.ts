import { v4 as uuidv4 } from 'uuid';
import { User, userToDynamoDBItem } from '../models/user';
import { GetItemCommand, UpdateItemCommand, DeleteItemCommand, ScanCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { connectDB } from '../config/database';
import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';

const TABLE_NAME = 'users';

const removeUndefinedProperties = (item: Record<string, AttributeValue>): Record<string, AttributeValue> => {
  const cleanedItem: Record<string, AttributeValue> = {};
  
  for (const key in item) {
    if (item[key] !== undefined) {
      cleanedItem[key] = item[key];
    }
  }
  
  return cleanedItem;
};

// Función para agregar un usuario
export const addUser = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {

  const newFund: User = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    ...userData,
  };
   
  try {
    const dbClient = connectDB();
    const item = newFund;
 
  
    await dbClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    }));
  
    return newFund; 
  } catch (error) {
    console.error('Error subscribing to fund:', error);
    throw new Error(`Failed to subscribe to the fund: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Función para obtener un usuario por ID
export const getUserById = async (id: string) => {
  const result = await connectDB().send(new GetItemCommand({
    TableName: 'users',
    Key: {
      id: { S: id },
    },
  }));
  
  // Aquí se asegura que si un campo está indefinido, se le asigna un valor por defecto
  return result.Item ? {
    id: result.Item.id?.S ?? '',  // Si el valor es undefined, se asigna una cadena vacía
    name: result.Item.name?.S ?? '', 
    documento: result.Item.documento?.S ?? '',
    email: result.Item.email?.S ?? '',
    balance: Number(result.Item.balance?.N ?? 0),  // Si es undefined, se asigna 0
    createdAt: result.Item.createdAt?.S ?? '',
  } : null;
};

// Función para actualizar un usuario
export const updateUser = async (id: string, updatedData: Partial<User>) => {
  const updateExpression = Object.keys(updatedData)
    .map((key, index) => `${key} = :value${index}`)
    .join(', ');

  const expressionAttributeValues = Object.keys(updatedData).reduce((acc, key, index) => {
    const typedKey = key as keyof User;

    if (typeof updatedData[typedKey] === 'string') {
      acc[`:value${index}`] = { S: updatedData[typedKey] as string };
    } else if (typeof updatedData[typedKey] === 'number') {
      acc[`:value${index}`] = { N: updatedData[typedKey]!.toString() };
    }
    
    return acc;
  }, {} as Record<string, AttributeValue>);

  await connectDB().send(new UpdateItemCommand({
    TableName: 'users',
    Key: {
      id: { S: id },
    },
    UpdateExpression: `SET ${updateExpression}`,
    ExpressionAttributeValues: expressionAttributeValues,
  }));

  return await getUserById(id);
};

// Función para eliminar un usuario
export const deleteUser = async (id: string) => {
  const result = await connectDB().send(new DeleteItemCommand({
    TableName: 'users',
    Key: {
      id: { S: id },
    },
  }));
  return result.Attributes ? true : false;
};

// Función para obtener todos los usuarios
export const getAllUsers = async (): Promise<User[]> => {
  const dbClient = connectDB();
  const result = await dbClient.send(new ScanCommand({
    TableName: TABLE_NAME,
  }));

  // Mapear los resultados a objetos de tipo User
  return result.Items?.map(item => ({
    id: item.id?.S ?? '',  // Manejo de valores indefinidos
    name: item.name?.S ?? '',
    documento: item.documento?.S ?? '',
    email: item.email?.S ?? '',
    balance: Number(item.balance?.N ?? 0),
    createdAt: item.createdAt?.S ?? '',
  })) || [];
};

// Función para obtener un usuario por documento
export const getUserByDocument = async (documento: string): Promise<User | null> => {
  const dbClient = connectDB();

  const result = await dbClient.send(new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: 'documento-index',
    KeyConditionExpression: 'documento = :documento',
    ExpressionAttributeValues: {
      ':documento': { S: documento },
    },
  }));

  if (result.Items?.length) {
    const item = result.Items[0];
    return {
      id: item.id?.S ?? '',  // Manejo de valores indefinidos
      name: item.name?.S ?? '',
      documento: item.documento?.S ?? '',
      email: item.email?.S ?? '',
      balance: Number(item.balance?.N ?? 0),
      createdAt: item.createdAt?.S ?? '',
    };
  }

  return null;
};
