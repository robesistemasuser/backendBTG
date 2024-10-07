import { DynamoDBClient, CreateTableCommand, ListTablesCommand, DescribeTableCommand } from '@aws-sdk/client-dynamodb';
import dotenv from 'dotenv';

dotenv.config();

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION || 'us-east-1';

if (!accessKeyId || !secretAccessKey) {
  throw new Error('AWS_ACCESS_KEY_ID y AWS_SECRET_ACCESS_KEY deben estar definidos');
}

const client = new DynamoDBClient({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// Función para conectar a DynamoDB
export const connectDB = () => {
 
  return client;
};

// Función genérica para crear tablas si no existen
export const createTableIfNotExists = async (tableName: string, keySchema: any[], attributeDefinitions: any[]) => {
  try {
  
    await client.send(new DescribeTableCommand({ TableName: tableName }));

  } catch (error: any) {
    if (error.name === 'ResourceNotFoundException') {
      // Si la tabla no existe, la creamos
      const createTableCommand = new CreateTableCommand({
        TableName: tableName,
        KeySchema: keySchema,
        AttributeDefinitions: attributeDefinitions,
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      });

      await client.send(createTableCommand);
     
    } else {
      // Manejo de otros errores
      console.error(`Error al verificar o crear la tabla ${tableName}:`, error);
      throw error; // Vuelve a lanzar el error para manejarlo en otro lugar si es necesario
    }
  }
};

// Función para crear la tabla de usuarios
export const createUsersTableIfNotExists = async () => {
  const tableName = 'users';
  const keySchema = [{ AttributeName: 'id', KeyType: 'HASH' }];
  const attributeDefinitions = [{ AttributeName: 'id', AttributeType: 'S' }];

  await createTableIfNotExists(tableName, keySchema, attributeDefinitions);
};

// Función para crear la tabla de fondos
export const createFundsTableIfNotExists = async () => {
  const tableName = 'funds';
  const keySchema = [{ AttributeName: 'id', KeyType: 'HASH' }];
  const attributeDefinitions = [{ AttributeName: 'id', AttributeType: 'S' }];

  await createTableIfNotExists(tableName, keySchema, attributeDefinitions);
};

// Función para crear la tabla de fondos de usuarios
export const createUsersFundsTableIfNotExists = async () => {
  const tableName = 'userfunds';
  const keySchema = [
    { AttributeName: 'userId', KeyType: 'HASH' }, // Clave de partición
    { AttributeName: 'fundId', KeyType: 'RANGE' }, // Clave de ordenación
  ];

  const attributeDefinitions = [
    { AttributeName: 'userId', AttributeType: 'S' }, // Definición de tipo para userId
    { AttributeName: 'fundId', AttributeType: 'S' },  // Definición de tipo para fundId
  ];

  await createTableIfNotExists(tableName, keySchema, attributeDefinitions);
};

// Función para crear la tabla de transacciones
export const createtransactionTableIfNotExists = async () => {
  const tableName = 'transaction';
  const keySchema = [{ AttributeName: 'transactionId', KeyType: 'HASH' }];
  const attributeDefinitions = [{ AttributeName: 'transactionId', AttributeType: 'S' }];

  await createTableIfNotExists(tableName, keySchema, attributeDefinitions);
};
