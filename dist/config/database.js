"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createtransactionTableIfNotExists = exports.createUsersFundsTableIfNotExists = exports.createFundsTableIfNotExists = exports.createUsersTableIfNotExists = exports.createTableIfNotExists = exports.connectDB = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION || 'us-east-1';
if (!accessKeyId || !secretAccessKey) {
    throw new Error('AWS_ACCESS_KEY_ID y AWS_SECRET_ACCESS_KEY deben estar definidos');
}
const client = new client_dynamodb_1.DynamoDBClient({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});
// Función para conectar a DynamoDB
const connectDB = () => {
    return client;
};
exports.connectDB = connectDB;
// Función genérica para crear tablas si no existen
const createTableIfNotExists = async (tableName, keySchema, attributeDefinitions) => {
    try {
        await client.send(new client_dynamodb_1.DescribeTableCommand({ TableName: tableName }));
    }
    catch (error) {
        if (error.name === 'ResourceNotFoundException') {
            // Si la tabla no existe, la creamos
            const createTableCommand = new client_dynamodb_1.CreateTableCommand({
                TableName: tableName,
                KeySchema: keySchema,
                AttributeDefinitions: attributeDefinitions,
                ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5,
                },
            });
            await client.send(createTableCommand);
        }
        else {
            // Manejo de otros errores
            console.error(`Error al verificar o crear la tabla ${tableName}:`, error);
            throw error; // Vuelve a lanzar el error para manejarlo en otro lugar si es necesario
        }
    }
};
exports.createTableIfNotExists = createTableIfNotExists;
// Función para crear la tabla de usuarios
const createUsersTableIfNotExists = async () => {
    const tableName = 'users';
    const keySchema = [{ AttributeName: 'id', KeyType: 'HASH' }];
    const attributeDefinitions = [{ AttributeName: 'id', AttributeType: 'S' }];
    await (0, exports.createTableIfNotExists)(tableName, keySchema, attributeDefinitions);
};
exports.createUsersTableIfNotExists = createUsersTableIfNotExists;
// Función para crear la tabla de fondos
const createFundsTableIfNotExists = async () => {
    const tableName = 'funds';
    const keySchema = [{ AttributeName: 'id', KeyType: 'HASH' }];
    const attributeDefinitions = [{ AttributeName: 'id', AttributeType: 'S' }];
    await (0, exports.createTableIfNotExists)(tableName, keySchema, attributeDefinitions);
};
exports.createFundsTableIfNotExists = createFundsTableIfNotExists;
// Función para crear la tabla de fondos de usuarios
const createUsersFundsTableIfNotExists = async () => {
    const tableName = 'userfunds';
    const keySchema = [
        { AttributeName: 'userId', KeyType: 'HASH' }, // Clave de partición
        { AttributeName: 'fundId', KeyType: 'RANGE' }, // Clave de ordenación
    ];
    const attributeDefinitions = [
        { AttributeName: 'userId', AttributeType: 'S' }, // Definición de tipo para userId
        { AttributeName: 'fundId', AttributeType: 'S' }, // Definición de tipo para fundId
    ];
    await (0, exports.createTableIfNotExists)(tableName, keySchema, attributeDefinitions);
};
exports.createUsersFundsTableIfNotExists = createUsersFundsTableIfNotExists;
// Función para crear la tabla de transacciones
const createtransactionTableIfNotExists = async () => {
    const tableName = 'transaction';
    const keySchema = [{ AttributeName: 'transactionId', KeyType: 'HASH' }];
    const attributeDefinitions = [{ AttributeName: 'transactionId', AttributeType: 'S' }];
    await (0, exports.createTableIfNotExists)(tableName, keySchema, attributeDefinitions);
};
exports.createtransactionTableIfNotExists = createtransactionTableIfNotExists;
