require('dotenv').config();
const database = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

async function login(req, res) {
    try {
        const usuario = await database.usuarios.findOne(
            {   
                where : {
                    email: req.body.email
                }
            }
        );

        console.log(usuario);

        if(usuario.email == req.body.email && bcrypt.compareSync(req.body.senha, usuario.senha)) {
            res.status(200).json({mensagem:'Login feito com sucesso'});
        } else {
            res.status(200).json({mensagem:'Usuário ou senha incorreta!'});
        }
    } catch(err) {
        res.status(500).json({mensagem:' Erro ao logar com usuario', erro: err.message});
    }
}

async function logout (req, res) {
    res.end();
}
 
module.exports = {
    create,
    login,
    logout
}