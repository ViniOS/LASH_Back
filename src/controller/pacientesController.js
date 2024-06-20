const database = require("../models");
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');

// Função para converter data de dd/mm/yyyy para yyyy-mm-dd
const formatarData = (date) => {
  const [dia, mes, ano] = date.split("/");
  return `${ano}-${mes}-${dia}`;
};

// Função para extrair e verificar o token JWT do cabeçalho Authorization
const extrairToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1]; // Retorna apenas o token, sem o prefixo 'Bearer '
  }
  return null; // Retorna null se não houver token no cabeçalho
};

/**
 * @swagger
 * tags:
 *   name: Frequencia
 *   description: Endpoints para operações relacionadas a frequências.
 */

/**
 * @swagger
 * /findAll:
 *   get:
 *     summary: Retorna todas as frequências com seus pacientes relacionados.
 *     tags: [Frequencia]
 *     description: Retorna um array com todas as frequências e seus respectivos pacientes.
 *     responses:
 *       200:
 *         description: Array contendo todas as frequências com os pacientes relacionados.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
async function findAll(req, res) {
  try {
    const token = extrairToken(req); // Extrai o token do cabeçalho Authorization
    if (!token) {
      return res.status(401).json({ mensagem: "Token não fornecido" });
    }

    // Verifica e decodifica o token
    const payload = jwt.verify(token, process.env.PG_SECRET);

    const pacientesArray = await database.frequencia.findAll({
      include: {
        model: database.pacientes,
        as: "paciente",
        on: {
          "$frequencia.pacienteId$": { [Op.col]: "paciente.id" },
        },
      },
    });
    res.status(200).json(pacientesArray);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao buscar pacientes", erro: err.message });
  }
}

/**
 * @swagger
 * /findById/{id}:
 *   get:
 *     summary: Retorna uma frequência pelo ID com seu paciente relacionado.
 *     tags: [Frequencia]
 *     description: Retorna a frequência com o paciente correspondente ao ID fornecido.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da frequência a ser buscada.
 *     responses:
 *       200:
 *         description: Objeto contendo a frequência com o paciente relacionado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
async function findById(req, res) {
  try {
    const token = extrairToken(req); // Extrai o token do cabeçalho Authorization
    if (!token) {
      return res.status(401).json({ mensagem: "Token não fornecido" });
    }

    // Verifica e decodifica o token
    const payload = jwt.verify(token, process.env.PG_SECRET);

    const paciente = await database.frequencia.findAll({
      include: {
        model: database.pacientes,
        as: "paciente",
        on: {
          "$frequencia.pacienteId$": { [Op.col]: "paciente.id" },
        },
      },
      where: {
        pacienteId: req.params.id,
      },
    });
    res.status(200).json(paciente);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao buscar paciente", erro: err.message });
  }
}

/**
 * @swagger
 * /create:
 *   post:
 *     summary: Cria uma nova frequência associada a um paciente.
 *     tags: [Frequencia]
 *     description: Cria uma nova frequência para o paciente especificado no corpo da requisição.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pacienteId:
 *                 type: integer
 *                 description: ID do paciente associado à frequência.
 *             required:
 *               - pacienteId
 *     responses:
 *       200:
 *         description: Objeto contendo a frequência recém-criada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
async function create(req, res) {
  try {
    const token = extrairToken(req); // Extrai o token do cabeçalho Authorization
    if (!token) {
      return res.status(401).json({ mensagem: "Token não fornecido" });
    }

    // Verifica e decodifica o token
    const payload = jwt.verify(token, process.env.PG_SECRET);

    const frequencia = await database.frequencia.create({
      pacienteId: req.body.pacienteId,
    });
    
    res.status(200).json(frequencia);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao criar frequência", erro: err.message });
  }
}

/**
 * @swagger
 * /remove/{id}:
 *   delete:
 *     summary: Remove uma frequência pelo ID.
 *     tags: [Frequencia]
 *     description: Remove a frequência com o ID especificado.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da frequência a ser removida.
 *     responses:
 *       200:
 *         description: Mensagem de sucesso ao excluir a frequência.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
async function remove(req, res) {
  try {
    const token = extrairToken(req); // Extrai o token do cabeçalho Authorization
    if (!token) {
      return res.status(401).json({ mensagem: "Token não fornecido" });
    }

    // Verifica e decodifica o token
    const payload = jwt.verify(token, process.env.PG_SECRET);

    const frequencia = await database.frequencia.findByPk(req.params.id);

    frequencia.destroy();  
    res.status(200).json({ mensagem: `Frequência excluída com sucesso`, ok: true }); 
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao buscar frequência", erro: err.message });
  }
}

module.exports = {
  findAll,
  findById,
  create,
  remove,
};
