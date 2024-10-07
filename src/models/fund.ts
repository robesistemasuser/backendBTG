// src/models/fund.ts

import { AttributeValue } from '@aws-sdk/client-dynamodb';

// Definición de la interfaz Fund
export interface Fund {
  id: string;        // ID único del fondo (PK)
  name: string;          // Nombre del fondo
  minAmount: number;     // Monto mínimo para suscribirse
  category: string;      // Categoría del fondo
  createdAt: string;     // Fecha de creación del fondo (timestamp)
}


// Función para convertir Fund a un formato compatible con DynamoDB
export const fundToDynamoDBItem = (fund: Fund): Record<string, AttributeValue> => {
  const item: Record<string, AttributeValue> = {
    id: { S: fund.id },                          // 'S' indica que es un string
    name: { S: fund.name },
    minAmount: { N: fund.minAmount.toString() }, // Convertir a string para DynamoDB
    category: { S: fund.category },
    createdAt: { S: fund.createdAt },    
    
  };

 

  return item;
};
