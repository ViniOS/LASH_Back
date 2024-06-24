const database = require('../models');
const { Op } = require('sequelize');
const { format } = require('date-fns'); // Importar a função format do date-fns

async function findAll(req, res) {
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

        // Formatar a data de createdAt e updatedAt
        const formattedFrequenciaArray = frequenciaArray.map(frequencia => {
            return {
                id: frequencia.id,
                pacienteId: frequencia.pacienteId,
                createdAt: format(new Date(frequencia.createdAt), 'dd/MM/yyyy HH:mm:ss'),
                updatedAt: format(new Date(frequencia.updatedAt), 'dd/MM/yyyy HH:mm:ss'),
                paciente: frequencia.paciente // Manter o objeto paciente como está
            };
        });

        res.status(200).json(formattedFrequenciaArray);
    } catch(err) {
        res.status(500).json({ mensagem: 'Erro ao buscar frequencias', erro: err.message });
    }
}

async function findById(req, res) {
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

        // Formatar a data de createdAt e updatedAt
        const formattedPaciente = paciente.map(item => ({
            id: item.id,
            pacienteId: item.pacienteId,
            createdAt: format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm:ss'),
            updatedAt: format(new Date(item.updatedAt), 'dd/MM/yyyy HH:mm:ss'),
            paciente: item.paciente // Manter o objeto paciente como está
        }));

        res.status(200).json(formattedPaciente);
    } catch(err) {
        res.status(500).json({ mensagem: 'Erro ao buscar paciente', erro: err.message });
    }
}

async function create(req, res) {
    try {
        // Encontrar o paciente pelo CPF fornecido
        const paciente = await database.pacientes.findOne({
            where: {
                cpf: req.body.cpf // Supondo que o CPF seja enviado no corpo da requisição
            }
        });

        if (!paciente) {
            return res.status(404).json({ mensagem: 'Paciente não encontrado com o CPF fornecido' });
        }

        // Criar a frequência associada ao paciente encontrado
        const frequencia = await database.frequencia.create({
            pacienteId: paciente.id
        });

        res.status(200).json(frequencia);
    } catch(err) {
        res.status(500).json({ mensagem: 'Erro ao criar frequencia', erro: err.message });
    }
}

async function remove(req, res) {
    try {
        const frequencia = await database.frequencia.findByPk(req.params.id);

        frequencia.destroy();  
        res.status(200).json({ mensagem: `Frequencia excluída com sucesso`, ok: true }); 
    } catch(err) {
        res.status(500).json({ mensagem: 'Erro ao buscar frequencia', erro: err.message });
    }
}

module.exports = {
    findAll,
    findById,
    create,
    remove
};
