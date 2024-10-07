import express from 'express';
import fundRoutes from './routes/fundRoutes';
import userRoutes from './routes/userRoutes'; // Importar las rutas de usuarios
import userFundsRoutes from './routes/userFundRoutes';
import transactionsRoutes from './routes/transactionRoutes';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { errorHandler } from './middlewares/errorHandler';
import { connectDB, createFundsTableIfNotExists, createtransactionTableIfNotExists, createUsersFundsTableIfNotExists, createUsersTableIfNotExists } from './config/database';

import cors from 'cors';
import notificationRoutes from './routes/notification.routes';

const app = express();

// Configuración CORS
app.use(cors({
  origin: '*', // Permitir cualquier origen
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
})); 

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Fondos y Usuarios',
      version: '1.0.0',
      description: 'API para gestionar fondos y usuarios',
    },
    servers: [
      {
        url: 'http://190.156.150.149:3010', // Cambia esto si usas un puerto diferente
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Asegúrate de que esta ruta coincida con la ubicación de tus archivos de rutas
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Montar Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware para parsear JSON
app.use(express.json());

// Conectar a DynamoDB y crear las tablas si no existen
connectDB();
Promise.all([
  createFundsTableIfNotExists(),
  createUsersTableIfNotExists(),
  createUsersFundsTableIfNotExists(),
  createtransactionTableIfNotExists()
])
  .then(() => {
    console.log('DynamoDB connected and tables are ready.');
  })
  .catch((error) => {
    console.error('Error initializing DynamoDB:', error);
  });

// Montar las rutas de fondos y usuarios
app.use('/funds', fundRoutes); // Prefijo '/funds' para rutas de fondos
app.use('/users', userRoutes);  // Prefijo '/users' para rutas de usuarios
app.use('/userFunds', userFundsRoutes);
app.use('/transactions', transactionsRoutes);
app.use('/notifications', notificationRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

// Ruta de prueba (opcional)
app.get('/', (req, res) => {
  res.send('API de Fondos y Usuarios está funcionando');
});

// Configurar el puerto
const PORT = Number(process.env.PORT) || 3010; // Asegúrate de que PORT sea un número

// Escuchar en todas las interfaces para permitir conexiones externas
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://190.156.150.149:${PORT}`);
});

// Exportar la aplicación
export default app;
