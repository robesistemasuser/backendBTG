import { AttributeValue } from '@aws-sdk/client-dynamodb';

export interface UserFunds {
  userId: string;                  // ID del usuario
  fundId: string;                  // ID del fondo
  document: string;    
  fundName:string,   
  transactionType: 'subscribe' | 'unsubscribe'; // Tipo de transacción
  subscriptionDate: string;        // Fecha de la suscripción/desuscripción
  amount: number;                  // Monto de la suscripción
  active: boolean;                 // Estado de la suscripción (true para suscrito, false para desuscripto)
  createdAt: string;               // Fecha en que se creó el registro
}

// Función para convertir UserFunds a un formato compatible con DynamoDB
export const userFundsToDynamoDBItem = (userFunds: UserFunds): Record<string, AttributeValue> => {
  const item: Record<string, AttributeValue> = {
    userId: { S: userFunds.userId },                      // String
    fundId: { S: userFunds.fundId },                      // String
    document: { S: userFunds.document },       
    fundName: { S: userFunds.fundName },       
    transactionType: { S: userFunds.transactionType },    // String
    subscriptionDate: { S: userFunds.subscriptionDate },  // String
    amount: { N: userFunds.amount.toString() },           // Number convertido a string
    active: { BOOL: userFunds.active },                   // Booleano
    createdAt: { S: userFunds.createdAt },                // String
  };

   

  return item;
};
