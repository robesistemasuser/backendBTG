"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notification_routes_1 = __importDefault(require("../routes/notification.routes"));
const app = (0, express_1.default)();
// Middlewares
app.use(express_1.default.json()); // Para analizar las solicitudes JSON
// Registrar rutas
app.use('/api', notification_routes_1.default);
exports.default = app;
