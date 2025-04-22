const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');  // Importando o middleware
const router = express.Router();
const userController = require('../controllers/userController');  // Certifique-se de que o caminho está correto

// Rota para criar um novo usuário
router.post('/registrar', userController.createUser); // rota usuarios/registrar

// Rota para login de usuário
router.post('/login', userController.loginUser);

// Rota para obter o perfil do usuário
router.get('/perfil', authMiddleware, userController.getUserProfile);

// Rota para editar o perfil do usuário
router.put('/perfil', authMiddleware, userController.editUserProfile);

// Rota para excluir o usuário (exclusão lógica)
router.delete('/excluir/:id', authMiddleware, userController.deleteUser);



module.exports = router;