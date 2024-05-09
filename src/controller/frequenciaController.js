const database = require('../models');
const { Op } = require('sequelize');

async function findAll(req, res) {

    // #swagger.tags = ['Frequencia']
    // #swagger.description = 'Endpoint para pesquisar todas as frequencias.'

    try {
        const frequenciaArray = await database.frequencia.findAll({
            include: {
                model: database.pacientes,
                as: 'paciente',
                on: {
                    '$frequencia.pacienteId$': { [Op.col]: 'paciente.id' }
                }
            }
        });
        res.status(200).json(frequenciaArray);
    } catch(err) {
        res.status(500).json({mensagem:' Erro ao buscar frequencias', erro: err.message});
    }
}

async function findById(req, res) {
    // #swagger.tags = ['Frequencia']
    // #swagger.description = 'Endpoint para pesquisar frequencia por ID.'
    try {
        const paciente = await database.frequencia.findAll(
            {   
                include: {
                    model: database.pacientes,
                    as: 'paciente',
                    on: {
                        '$frequencia.pacienteId$': { [Op.col]: 'paciente.id' }
                    }
                },
                where : {
                    pacienteId: req.params.id
                }
            }
        );
        res.status(200).json(paciente);
    } catch(err) {
        res.status(500).json({mensagem:' Erro ao buscar paciente', erro: err.message});
    }
}

async function create(req, res) {
    // #swagger.tags = ['Frequencia']
    // #swagger.description = 'Endpoint para criar uma nova frequencia.'

    try {
        const frequencia = await database.frequencia.create({
            pacienteId: req.body.pacienteId
        });
        
        res.status(200).json(frequencia);
    } catch(err) {
        res.status(500).json({mensagem:' Erro ao criar frequencia', erro: err.message});
    }
}

async function remove(req, res) {
    // #swagger.tags = ['Frequencia']
    // #swagger.description = 'Endpoint para deletar uma frequencia.'

    try {
        const frequencia = await database.frequencia.findByPk(req.params.id);

        frequencia.destroy();  
        res.status(200).json({mensagem: `Frequencia excluída com sucesso`, ok: true}); 
    } catch(err) {
        res.status(500).json({mensagem:' Erro ao buscar frequencia', erro: err.message});
    }
}

module.exports = {
    findAll,
    findById,
    create,
    remove
}