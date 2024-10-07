"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fundRoutes_1 = __importDefault(require("./routes/fundRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes")); // Importar las rutas de usuarios
const userFundRoutes_1 = __importDefault(require("./routes/userFundRoutes"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const errorHandler_1 = require("./middlewares/errorHandler");
const database_1 = require("./config/database");
const cors_1 = __importDefault(require("cors"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const app = (0, express_1.default)();
// Configuración CORS
app.use((0, cors_1.default)({
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
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
// Montar Swagger UI
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
// Middleware para parsear JSON
app.use(express_1.default.json());
// Conectar a DynamoDB y crear las tablas si no existen
(0, database_1.connectDB)();
Promise.all([
    (0, database_1.createFundsTableIfNotExists)(),
    (0, database_1.createUsersTableIfNotExists)(),
    (0, database_1.createUsersFundsTableIfNotExists)(),
    (0, database_1.createtransactionTableIfNotExists)()
])
    .then(() => {
    console.log('DynamoDB connected and tables are ready.');
})
    .catch((error) => {
    console.error('Error initializing DynamoDB:', error);
});
// Montar las rutas de fondos y usuarios
app.use('/funds', fundRoutes_1.default); // Prefijo '/funds' para rutas de fondos
app.use('/users', userRoutes_1.default); // Prefijo '/users' para rutas de usuarios
app.use('/userFunds', userFundRoutes_1.default);
app.use('/transactions', transactionRoutes_1.default);
app.use('/api', notification_routes_1.default);
// Middleware de manejo de errores
app.use(errorHandler_1.errorHandler);
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
exports.default = app;
