const database = require('../models');

/**
 * @swagger
 * tags:
 *   name: Doenca
 *   description: Endpoints para gerenciar doenças.
 */

/**
 * @swagger
 * /doencas:
 *   get:
 *     summary: Retorna todas as doenças.
 *     tags: [Doenca]
 *     description: Endpoint para buscar todas as doenças cadastradas.
 *     responses:
 *       200:
 *         description: Array de objetos doença.
 *       500:
 *         description: Erro ao buscar doenças.
 */
async function findAll(req, res) {
    try {
        const doencasArray = await database.doencas.findAll({
            attributes: ['id', 'nome'] // Seleciona apenas os atributos necessários
        });
        res.status(200).json(doencasArray);
    } catch(err) {
        res.status(500).json({ mensagem: 'Erro ao buscar doenças', erro: err.message });
    }
}

/**
 * @swagger
 * /doencas/{nome}:
 *   get:
 *     summary: Retorna uma doença pelo nome.
 *     tags: [Doenca]
 *     description: Endpoint para buscar uma doença pelo nome.
 *     parameters:
 *       - in: path
 *         name: nome
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome da doença a ser buscada.
 *     responses:
 *       200:
 *         description: Objeto doença encontrado.
 *       500:
 *         description: Erro ao buscar doença.
 */
async function findByName(req, res) {
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

/**
 * @swagger
 * /doencas/{id}:
 *   get:
 *     summary: Retorna uma doença pelo ID.
 *     tags: [Doenca]
 *     description: Endpoint para buscar uma doença pelo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da doença a ser buscada.
 *     responses:
 *       200:
 *         description: Objeto doença encontrado.
 *       500:
 *         description: Erro ao buscar doença.
 */
async function findByPk(req, res) {
    try {
        const doenca = await database.doencas.findByPk(req.params.id);
        res.status(200).json(doenca);
    } catch(err) {
        res.status(500).json({mensagem:' Erro ao buscar doenças', erro: err.message});
    }
}

/**
 * @swagger
 * /doencas:
 *   post:
 *     summary: Cria uma nova doença.
 *     tags: [Doenca]
 *     description: Endpoint para criar uma nova doença.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *             example:
 *               nome: Febre
 *     responses:
 *       200:
 *         description: Objeto doença criada.
 *       500:
 *         description: Erro ao criar doença.
 */
async function create(req, res) {
    try {
        const doenca = await database.doencas.create({
            nome: req.body.nome
        });
        
        res.status(200).json(doenca);
    } catch(err) {
        res.status(500).json({mensagem:' Erro ao criar doença', erro: err.message});
    }
}

/**
 * @swagger
 * /doencas/{id}:
 *   put:
 *     summary: Altera uma doença pelo ID.
 *     tags: [Doenca]
 *     description: Endpoint para alterar uma doença pelo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da doença a ser alterada.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *             example:
 *               nome: Gripe
 *     responses:
 *       200:
 *         description: Objeto doença alterada.
 *       500:
 *         description: Erro ao buscar doença.
 */
async function alter(req, res) {

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

/**
 * @swagger
 * /doencas/{id}:
 *   delete:
 *     summary: Remove uma doença pelo ID.
 *     tags: [Doenca]
 *     description: Endpoint para remover uma doença pelo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da doença a ser removida.
 *     responses:
 *       200:
 *         description: Mensagem de sucesso.
 *       500:
 *         description: Erro ao buscar doença.
 */
async function remove(req, res) {
    try {
        const doenca = await database.doencas.findByPk(req.params.id);

        let nomeDoenca = doenca.nome;
        doenca.destroy();  
        res.status(200).json({mensagem: `${nomeDoenca} excluída com sucesso`, ok: true}); 
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
