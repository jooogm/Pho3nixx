const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const VagaController = require('../controllers/vagaController'); // Certifique-se de que o caminho está correto

// Rota para criar uma vaga
router.post('/criar', VagaController.criarVaga);

// Rota para listar todas as vagas (opcional com filtro por título)
router.get('/', VagaController.listarVagas);

// Rota para atualizar uma vaga
router.put('/:id', VagaController.atualizarVaga);

// Rota para excluir uma vaga
router.delete('/:id', VagaController.excluirVaga);

// Rota para restaurar uma vaga excluída
router.put('/restaurar/:id', VagaController.restaurarVaga);


// Rota para análise de perfis compatíveis com uma vaga
router.get('/analise/:vagaId', VagaController.getVagaAnalise);

// Rota para listar vagas abertas
router.get('/abertas', VagaController.listarVagasAbertas);

// Rota para buscar uma vaga por ID
router.get('/:id', VagaController.buscarVagaPorId);

module.exports = router;