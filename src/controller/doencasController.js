const database = require('../models');

async function findAll(req, res) {

    // #swagger.tags = ['Doenças']
    // #swagger.description = 'Endpoints para obter todos as doenças cadastradas.'
    try {
        const doencasArray = await database.doencas.findAll();
        res.status(200).json(doencasArray);
    } catch(err) {
        res.status(500).json({mensagem:' Erro ao buscar doenças', erro: err.message});
    }
}

async function findByName(req, res) {
    // #swagger.tags = ['Doenças']
    // #swagger.description = 'Endpoints para obter uma doença pelo nome.'

    try {
        const doenca = await database.doencas.findAll(
            {
                where : {
                    nome: req.params.nome
                }
            }
        );
        res.status(200).json(doenca);
    } catch(err) {
        res.status(500).json({mensagem:' Erro ao buscar doenças', erro: err.message});
    }
}

async function findByPk(req, res) {
    // #swagger.tags = ['Doenças']
    // #swagger.description = 'Endpoints para obter uma doença pelo ID.'
    try {
        const doenca = await database.doencas.findByPk(req.params.id);
        res.status(200).json(doenca);
    } catch(err) {
        res.status(500).json({mensagem:' Erro ao buscar doenças', erro: err.message});
    }
}

async function create(req, res) {
    // #swagger.tags = ['Doenças']
    // #swagger.description = 'Endpoint para criar uma nova doença.'

    try {
        const doenca = await database.doencas.create({
            nome: req.body.nome
        });
        
        res.status(200).json(doenca);
    } catch(err) {
        res.status(500).json({mensagem:' Erro ao criar doença', erro: err.message});
    }
}

async function alter(req, res) {

    // #swagger.tags = ['Doenças']
    // #swagger.description = 'Endpoint para alterar uma doença pelo ID.'
    try {
        const verificacao = await database.doencas.update({
            nome: req.body.nome,
        },{
            where: {
                id: req.params.id
            }
        });

        if(verificacao > 0) {
            const doenca = await database.doencas.findByPk(req.params.id);
            res.status(200).json(doenca);
        } else {
            res.json({mensagem: "Doença inexistente"});
        }
    } catch(err) {
        res.status(500).json({mensagem:' Erro ao buscar doença', erro: err.message});
    }
}

async function remove(req, res) {
    // #swagger.tags = ['Doenças']
    // #swagger.description = 'Endpoint para remover uma doença.'

    try {
        const doenca = await database.doencas.findByPk(req.params.id);

        let nomeDoenca = doenca.nome;
        doenca.destroy();  
        res.status(200).json({mensagem: `${nomeDoenca} excluído com sucesso`, ok: true}); 
    } catch(err) {
        res.status(500).json({mensagem:' Erro ao buscar doença', erro: err.message});
    }
}

module.exports = {
    findAll,
    findByName,
    findByPk,
    create,
    alter,
    remove
}