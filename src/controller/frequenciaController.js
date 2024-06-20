const database = require('../models');
const { Op } = require('sequelize');

/**
 * @swagger
 * tags:
 *   name: Frequencia
 *   description: Endpoints para gerenciar frequências.
 */

/**
 * @swagger
 * /frequencias:
 *   get:
 *     summary: Retorna todas as frequências.
 *     tags: [Frequencia]
 *     description: Endpoint para buscar todas as frequências.
 *     responses:
 *       200:
 *         description: Array de objetos frequência.
 *       500:
 *         description: Erro ao buscar frequências.
 */
async function findAll(req, res) {
    try {
        const frequencias = await database.Frequencia.findAll();
        res.status(200).json(frequencias);
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao buscar frequências', erro: err.message });
    }
}

/**
 * @swagger
 * /frequencias/{id}:
 *   get:
 *     summary: Retorna frequências de um paciente pelo ID.
 *     tags: [Frequencia]
 *     description: Endpoint para buscar frequências de um paciente pelo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do paciente para buscar frequências.
 *     responses:
 *       200:
 *         description: Objeto frequência encontrado.
 *       500:
 *         description: Erro ao buscar paciente.
 */
async function findById(req, res) {
    const { id } = req.params;
    try {
        const frequencias = await database.Frequencia.findAll({
            where: { pacienteId: id },
        });
        res.status(200).json(frequencias);
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao buscar frequências', erro: err.message });
    }
}

/**
 * @swagger
 * /frequencias:
 *   post:
 *     summary: Cria uma nova frequência.
 *     tags: [Frequencia]
 *     description: Endpoint para criar uma nova frequência.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pacienteId:
 *                 type: integer
 *             example:
 *               pacienteId: 1
 *     responses:
 *       200:
 *         description: Objeto frequência criada.
 *       500:
 *         description: Erro ao criar frequência.
 */
async function create(req, res) {
    const { pacienteId } = req.body;
    try {
        const frequencia = await database.Frequencia.create({
            pacienteId,
        });
        res.status(200).json(frequencia);
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao criar frequência', erro: err.message });
    }
}

/**
 * @swagger
 * /frequencias/{id}:
 *   put:
 *     summary: Altera uma frequência pelo ID.
 *     tags: [Frequencia]
 *     description: Endpoint para alterar uma frequência pelo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da frequência a ser alterada.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pacienteId:
 *                 type: integer
 *             example:
 *               pacienteId: 2
 *     responses:
 *       200:
 *         description: Objeto frequência alterada.
 *       500:
 *         description: Erro ao buscar frequência.
 */
async function alter(req, res) {
    const { id } = req.params;
    const { pacienteId } = req.body;
    try {
        const frequencia = await database.Frequencia.findByPk(id);
        if (!frequencia) {
            res.status(404).json({ mensagem: 'Frequência não encontrada' });
        } else {
            await frequencia.update({ pacienteId });
            res.status(200).json(frequencia);
        }
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao buscar frequência', erro: err.message });
    }
}

/**
 * @swagger
 * /frequencias/{id}:
 *   delete:
 *     summary: Remove uma frequência pelo ID.
 *     tags: [Frequencia]
 *     description: Endpoint para remover uma frequência pelo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da frequência a ser removida.
 *     responses:
 *       200:
 *         description: Mensagem de sucesso.
 *       500:
 *         description: Erro ao buscar frequência.
 */
async function remove(req, res) {
    const { id } = req.params;
    try {
        const frequencia = await database.Frequencia.findByPk(id);
        if (!frequencia) {
            res.status(404).json({ mensagem: 'Frequência não encontrada' });
        } else {
            await frequencia.destroy();
            res.status(200).json({ mensagem: 'Frequência excluída com sucesso', ok: true });
        }
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao buscar frequência', erro: err.message });
    }
}

module.exports = {
    findAll,
    findById,
    create,
    alter,
    remove,
};
