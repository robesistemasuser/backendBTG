"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByDocumentController = exports.getAllUsersController = exports.deleteUserById = exports.updateUserById = exports.getUser = exports.createUser = void 0;
const uuid_1 = require("uuid");
const userService_1 = require("../services/userService");
// Controlador para agregar un usuario
const createUser = async (req, res) => {
    const userData = req.body; // Omitir el campo 'id' al recibir datos
    try {
        const user = Object.assign({ id: (0, uuid_1.v4)(), createdAt: new Date().toISOString() }, userData);
        await (0, userService_1.addUser)(user); // Llama a la función para agregar el usuario
        res.status(201).json({ message: 'Usuario creado exitosamente', user }); // Respuesta exitosa con datos del usuario creado
    }
    catch (error) {
        console.error('Error al crear el usuario:', error); // Registro del error
        res.status(500).json({ error: error.message || 'Error desconocido' }); // Respuesta de error
    }
};
exports.createUser = createUser;
// Controlador para obtener un usuario por ID
const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await (0, userService_1.getUserById)(id);
        if (user) {
            res.status(200).json(user); // Enviar el usuario si es encontrado
        }
        else {
            res.status(404).json({ message: 'Usuario no encontrado' }); // Respuesta en caso de no encontrar el usuario
        }
    }
    catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ error: error.message || 'Error desconocido' }); // Manejo de errores
    }
};
exports.getUser = getUser;
// Controlador para actualizar un usuario
const updateUserById = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body; // Datos actualizados
    try {
        const user = await (0, userService_1.updateUser)(id, updatedData);
        if (user) {
            res.status(200).json({ message: 'Usuario actualizado exitosamente', user }); // Devolver el usuario actualizado
        }
        else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    }
    catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ error: error.message || 'Error desconocido' });
    }
};
exports.updateUserById = updateUserById;
// Controlador para eliminar un usuario
const deleteUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const isDeleted = await (0, userService_1.deleteUser)(id); // Verificar si el usuario fue eliminado
        if (isDeleted) {
            res.status(200).json({ message: 'Usuario eliminado exitosamente' });
        }
        else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    }
    catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ error: error.message || 'Error desconocido' });
    }
};
exports.deleteUserById = deleteUserById;
// Controlador para obtener todos los usuarios
const getAllUsersController = async (req, res) => {
    try {
        const users = await (0, userService_1.getAllUsers)();
        res.status(200).json(users); // Enviar todos los usuarios
    }
    catch (error) {
        console.error('Error al obtener todos los usuarios:', error);
        res.status(500).json({ error: error.message || 'Error desconocido' });
    }
};
exports.getAllUsersController = getAllUsersController;
// Controlador para obtener un usuario por documento
const getUserByDocumentController = async (req, res) => {
    const { documento } = req.params;
    try {
        const user = await (0, userService_1.getUserByDocument)(documento);
        if (user) {
            res.status(200).json(user); // Enviar el usuario si es encontrado
        }
        else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    }
    catch (error) {
        console.error('Error al obtener el usuario por documento:', error);
        res.status(500).json({ error: error.message || 'Error desconocido' });
    }
};
exports.getUserByDocumentController = getUserByDocumentController;
