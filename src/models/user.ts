// src/models/user.ts

import { AttributeValue } from '@aws-sdk/client-dynamodb';

// Definición de la interfaz User
export interface User {
  id: string;    // ID del usuario
  name: string;      // Nombre del usuario
  documento: string;      // Documento del usuario
  email: string;     // Correo electrónico del usuario
  balance: number;   // Saldo actual del usuario
  createdAt: string; // Fecha de creación del usuario (timestamp)
}

// Función para convertir User a un formato compatible con DynamoDB
export const userToDynamoDBItem = (user: User): Record<string, AttributeValue> => {
  const item: Record<string, AttributeValue> = {
    id: { S: user.id },                        // 'S' indica que es un string
    name: { S: user.name },
    documento: { S: user.documento },
    email: { S: user.email },
    balance: { N: user.balance.toString() },           // Convertir balance a string para DynamoDB
    createdAt: { S: user.createdAt },                  // 'S' indica que es un string
  };

  return item;
};
