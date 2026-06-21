const express = require('express');
const router = express.Router();
const { register, login, loginGoogle, getProfile } = require('../controllers/UserController');
const { authMiddleware } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Cadastrar usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               senha:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *       400:
 *         description: Dados inválidos
 */
// POST /users/register — cadastro de usuário
router.post('/register', register);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login do usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               senha:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
// POST /users/login — autenticação
router.post('/login', login);

// POST /users/google — autenticação com Google
router.post('/google', loginGoogle);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Obter perfil do usuário autenticado
 *     description: Retorna as informações do usuário atualmente autenticado através do token JWT enviado no cabeçalho Authorization.
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil retornado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   example: João Silva
 *                 email:
 *                   type: string
 *                   example: joao@email.com
 *                 role:
 *                   type: string
 *                   example: usuario
 *       401:
 *         description: Token inválido ou não informado.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
// GET /users/profile — perfil do usuário autenticado
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
