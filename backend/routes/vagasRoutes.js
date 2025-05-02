const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const VagaController = require('../controllers/vagaController'); // Certifique-se de que o caminho está correto

// Rota para criar uma vaga
router.post('/criar', authMiddleware, VagaController.criarVaga);

// Rota para listar as vagas de uma empresa
router.get('/minhas', authMiddleware, VagaController.listarMinhasVagas);

// Rota para listar todas as vagas (opcional com filtro por título)
router.get('/', authMiddleware, VagaController.listarVagas);

// Rota para atualizar uma vaga
router.put('/:id', authMiddleware, VagaController.atualizarVaga);

// Rota para excluir uma vaga
router.delete('/:id', authMiddleware, VagaController.excluirVaga);

// Rota para restaurar uma vaga excluída
router.put('/restaurar/:id', authMiddleware, VagaController.restaurarVaga);


// Rota para análise de perfis compatíveis com uma vaga
router.get('/analise/:vagaId', authMiddleware, VagaController.getVagaAnalise);

// Rota para listar vagas abertas
router.get('/abertas', authMiddleware, VagaController.listarVagasAbertas);

// Rota para buscar uma vaga por ID
router.get('/:id', authMiddleware, VagaController.buscarVagaPorId);

module.exports = router;