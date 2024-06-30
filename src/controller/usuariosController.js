require('dotenv').config();
const database = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const revokedTokens = [];

/**
 * Cria um novo usuário.
 */
async function create(req, res) {
    try {
        const verificacao = await database.usuarios.findAll({ where: { email: req.body.email } });
        if (verificacao.length === 0) {
            const senha = bcrypt.hashSync(req.body.senha, 8);
            const usuario = await database.usuarios.create({ ...req.body, senha });
            res.status(200).json(usuario);
        } else {
            res.status(500).json({ mensagem: 'Usuário existente' });
        }
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao buscar usuario', erro: err.message });
    }
}

/**
 * Realiza o login de um usuário.
 */
async function login(req, res) {
    try {
        const usuario = await database.usuarios.findOne({ where: { email: req.body.email } });
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
 * Realiza o logout de um usuário.
 */
async function logout(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(400).json({ mensagem: 'Token não fornecido' });
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
        return res.status(400).json({ mensagem: 'Token inválido' });
    }

    revokedTokens.push(token);
    res.status(200).json({ mensagem: 'Logout realizado com sucesso' });
}

module.exports = {
    create,
    login,
    logout,
    revokedTokens
};
