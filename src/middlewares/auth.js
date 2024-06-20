require('dotenv').config();
const jwt = require('jsonwebtoken');
const database = require('../models');

async function eAdmin(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ mensagem: 'Necessário realizar o login para acessar a página' });
    }

    const [bearer, token] = authHeader.split(' ');

    try {
        const payload = jwt.verify(token, process.env.PG_SECRET);
        const usuario = await database.usuarios.findByPk(payload.id);

        if (!usuario) {
            return res.status(401).json({ mensagem: 'Usuário não encontrado' });
        }

        req.usuario = usuario;
        return next();
    } catch (err) {
        return res.status(401).json({ mensagem: 'Token inválido' });
    }
}

module.exports = {
    eAdmin
}
