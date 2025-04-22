const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const InscricaoController = require('../controllers/inscricaoController'); // Certifique-se de que o caminho está correto

// Rota para se candidatar a uma vaga
router.post('/candidatar/:vagaId', authMiddleware, InscricaoController.candidatarVaga);

// Rota para acompanhar as candidaturas do usuário
router.get('/acompanhamento', authMiddleware, InscricaoController.acompanharCandidatura);

// Rota para obter as inscrições ativas do usuário
router.get('/inscricoes', authMiddleware, InscricaoController.obterInscricoes);

// Rota para cancelar inscrição
router.delete('/cancelar/:inscricaoId', authMiddleware, InscricaoController.cancelarInscricao);

// Rota para obter candidatos de uma vaga
router.get('/candidatos/:vagaId', authMiddleware, InscricaoController.obterCandidatos);

// Rota para alterar o status da inscrição
router.put('/status/:inscricaoId', authMiddleware, InscricaoController.alterarStatus);

// Rota para obter o perfil de um candidato
router.get('/perfil/:userId', InscricaoController.obterPerfilCandidato);


module.exports = router;