const express = require('express');
const router = express.Router();
const {
  createReport,
  getAllReports,
  getReportsByLocation,
  updateStatus,
  deleteReport,
} = require('../controllers/ReportController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');
const { upload } = require('../services/uploadService');

/**
 * @swagger
 * /reports:
 *   get:
 *     summary: Listar ocorrências
 *     tags: [Ocorrências]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de ocorrências retornada com sucesso
 *       401:
 *         description: Token inválido ou ausente
 */
// GET /reports — listar Ocorrência do usuário (admin vê todas)
router.get('/', authMiddleware, getAllReports);

// GET /reports/nearby — buscar por proximidade (filtra por dono; admin vê todas)
router.get('/nearby', authMiddleware, getReportsByLocation);

/**
 * @swagger
 * /reports:
 *   post:
 *     summary: Criar nova ocorrência
 *     tags: [Ocorrências]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: Buraco na rua
 *               descricao:
 *                 type: string
 *                 example: Buraco próximo ao mercado
 *               categoria:
 *                 type: string
 *                 example: Infraestrutura
 *               latitude:
 *                 type: number
 *                 example: -27.0085
 *               longitude:
 *                 type: number
 *                 example: -51.1517
 *               imagem:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Ocorrência criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
// POST /reports — criar denúncia (autenticado, com upload opcional)
router.post('/', authMiddleware, upload.single('imagem'), createReport);

/**
 * @swagger
 * /reports/{id}/status:
 *   patch:
 *     summary: Atualizar status de uma ocorrência
 *     description: Permite que apenas administradores alterem o status de uma ocorrência cadastrada.
 *     tags: [Ocorrências]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da ocorrência a ser atualizada.
 *         schema:
 *           type: integer
 *           example: 15
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - pendente
 *                   - em_analise
 *                   - em_andamento
 *                   - resolvido
 *                   - rejeitado
 *                 example: resolvido
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso.
 *       400:
 *         description: Status inválido ou dados incorretos.
 *       401:
 *         description: Usuário não autenticado.
 *       403:
 *         description: Acesso negado. Apenas administradores podem alterar o status.
 *       404:
 *         description: Ocorrência não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
// PATCH /reports/:id/status — atualizar status (somente admin)
router.patch('/:id/status', authMiddleware, adminMiddleware, updateStatus);

/**
 * @swagger
 * /reports/{id}:
 *   delete:
 *     summary: Excluir uma ocorrência
 *     description: Remove uma ocorrência do sistema. A ação pode ser realizada pelo proprietário da ocorrência ou por um administrador.
 *     tags: [Ocorrências]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da ocorrência a ser removida.
 *         schema:
 *           type: integer
 *           example: 15
 *     responses:
 *       200:
 *         description: Ocorrência removida com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Ocorrência removida com sucesso.
 *       401:
 *         description: Usuário não autenticado.
 *       403:
 *         description: Usuário não possui permissão para remover esta ocorrência.
 *       404:
 *         description: Ocorrência não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
// DELETE /reports/:id — remover denúncia (dono ou admin)
router.delete('/:id', authMiddleware, deleteReport);

module.exports = router;