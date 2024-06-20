require('dotenv').config();
const database = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * tags:
 *   name: Usuario
 *   description: Endpoints para gerenciar usuários.
 */

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cria um novo usuário.
 *     tags: [Usuario]
 *     description: Endpoint para criar um novo usuário.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               sobrenome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *             example:
 *               nome: Fulano
 *               sobrenome: de Tal
 *               email: fulano@example.com
 *               senha: 123456
 *     responses:
 *       200:
 *         description: Objeto usuário criado.
 *       500:
 *         description: Erro ao criar usuário.
 */
async function create(req, res) {
    try {
        let verificacao = await database.usuarios.findAll({
            where: {
                email: req.body.email
            }
        });

        if(verificacao.length === 0) {
            try {
                const senha = bcrypt.hashSync(req.body.senha, 8);
    
                const usuario = await database.usuarios.create({
                    nome: req.body.nome,
                    sobrenome: req.body.sobrenome,
                    email: req.body.email,
                    senha: senha
                });
                
                res.status(200).json(usuario);
            } catch(err) {
                res.status(500).json({mensagem:' Erro ao criar usuario', erro: err.message});
            }   
        } else {
            res.status(500).json({mensagem:' Usuário existente'});
        }
    } catch (err) {
        res.status(500).json({mensagem:' Erro ao buscar usuario', erro: err.message});
    }
}

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Realiza o login de um usuário.
 *     tags: [Usuario]
 *     description: Endpoint para fazer login de usuário.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *             example:
 *               email: fulano@example.com
 *               senha: 123456
 *     responses:
 *       200:
 *         description: Login realizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Login feito com sucesso
 *                 token:
 *                   type: string
 *                   example: "jwt.token.aqui"
 *       401:
 *         description: Usuário ou senha incorretos.
 *       500:
 *         description: Erro ao logar com usuário.
 */
async function login(req, res) {
    try {
        const usuario = await database.usuarios.findOne({
            where: {
                email: req.body.email
            }
        });

        if (usuario && bcrypt.compareSync(req.body.senha, usuario.senha)) {
            const token = jwt.sign({ id: usuario.id }, process.env.PG_SECRET, { expiresIn: '1h' });
            res.status(200).json({ mensagem: 'Login feito com sucesso', token });
        } else {
            res.status(401).json({ mensagem: 'Usuário ou senha incorreta!' });
        }
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao logar com usuário', erro: err.message });
    }
}

/**
 * @swagger
 * /usuarios/logout:
 *   post:
 *     summary: Realiza o logout de um usuário.
 *     tags: [Usuario]
 *     description: Endpoint para fazer logout de usuário.
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso.
 */
async function logout(req, res) {
    res.end();
}

module.exports = {
    create,
    login,
    logout
}
