const database = require("../models");
const { Op } = require("sequelize");
const { format } = require('date-fns');

// Função para converter data de yyyy-MM-dd para dd/MM/yyyy
const formatarDataParaResposta = (data) => {
  return format(new Date(data), 'dd/MM/yyyy');
};

/**
 * @swagger
 * tags:
 *   name: Responsavel
 *   description: Endpoints para gerenciar responsáveis.
 */

/**
 * @swagger
 * /responsaveis:
 *   get:
 *     summary: Retorna todos os responsáveis.
 *     tags: [Responsavel]
 *     description: Endpoint para buscar todos os responsáveis cadastrados.
 *     responses:
 *       200:
 *         description: Array de objetos responsável.
 *       500:
 *         description: Erro ao buscar responsáveis.
 */
async function findAll(req, res) {
  try {
    const responsaveisArray = await database.responsaveis.findAll({
      include: {
        model: database.pacientes,
        as: "paciente",
        attributes: ['nome', 'sobrenome'], // Inclui apenas os atributos necessários
        on: {
          "$responsaveis.pacienteId$": { [Op.col]: "paciente.id" },
        },
      },
    });

    const responsaveisFormatados = responsaveisArray.map(responsavel => ({
      ...responsavel.toJSON(),
      createdAt: formatarDataParaResposta(responsavel.createdAt),
      updatedAt: formatarDataParaResposta(responsavel.updatedAt),
    }));

    res.status(200).json(responsaveisFormatados);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao buscar responsáveis", erro: err.message });
  }
}

/**
 * @swagger
 * /responsaveis/{nome}:
 *   get:
 *     summary: Retorna um responsável pelo nome.
 *     tags: [Responsavel]
 *     description: Endpoint para buscar um responsável pelo nome.
 *     parameters:
 *       - in: path
 *         name: nome
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome do responsável a ser buscado.
 *     responses:
 *       200:
 *         description: Objeto responsável encontrado.
 *       500:
 *         description: Erro ao buscar responsável.
 */
async function findByName(req, res) {
  try {
    const responsavel = await database.responsaveis.findAll({
      include: {
        model: database.pacientes,
        as: "paciente",
        attributes: ['nome', 'sobrenome'], // Inclui apenas os atributos necessários
        on: {
          "$responsaveis.pacienteId$": { [Op.col]: "paciente.id" },
        },
      },
      where: {
        nome: req.params.nome,
      },
    });

    const responsavelFormatado = responsavel.map(r => ({
      ...r.toJSON(),
      createdAt: formatarDataParaResposta(r.createdAt),
      updatedAt: formatarDataParaResposta(r.updatedAt),
    }));

    res.status(200).json(responsavelFormatado);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao buscar responsável", erro: err.message });
  }
}

/**
 * @swagger
 * /responsaveis/{id}:
 *   get:
 *     summary: Retorna um responsável pelo ID.
 *     tags: [Responsavel]
 *     description: Endpoint para buscar um responsável pelo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do responsável a ser buscado.
 *     responses:
 *       200:
 *         description: Objeto responsável encontrado.
 *       500:
 *         description: Erro ao buscar responsável.
 */
async function findByPk(req, res) {
  try {
    const responsavel = await database.responsaveis.findByPk(req.params.id, {
      include: {
        model: database.pacientes,
        as: "paciente",
        attributes: ['nome', 'sobrenome'], // Inclui apenas os atributos necessários
        on: {
          "$responsaveis.pacienteId$": { [Op.col]: "paciente.id" },
        },
      },
    });

    const responsavelFormatado = {
      ...responsavel.toJSON(),
      createdAt: formatarDataParaResposta(responsavel.createdAt),
      updatedAt: formatarDataParaResposta(responsavel.updatedAt),
    };

    res.status(200).json(responsavelFormatado);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao buscar responsável", erro: err.message });
  }
}

/**
 * @swagger
 * /responsaveis:
 *   post:
 *     summary: Cria um novo responsável.
 *     tags: [Responsavel]
 *     description: Endpoint para criar um novo responsável.
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
 *               cpf:
 *                 type: string
 *               rg:
 *                 type: string
 *               cidade:
 *                 type: string
 *               endereco:
 *                 type: string
 *               numero:
 *                 type: string
 *               uf:
 *                 type: string
 *               cep:
 *                 type: string
 *               bairro:
 *                 type: string
 *               pacienteId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Objeto responsável criado.
 *       400:
 *         description: Responsável já existe.
 *       500:
 *         description: Erro ao criar responsável.
 */
async function create(req, res) {
  try {
    var verificacao = await database.responsaveis.findAll({
      where: {
        cpf: req.body.cpf,
      },
    });

    if (verificacao.length === 0) {
      try {
        const responsavel = await database.responsaveis.create({
          nome: req.body.nome,
          sobrenome: req.body.sobrenome,
          cpf: req.body.cpf,
          rg: req.body.rg,
          cidade: req.body.cidade,
          endereco: req.body.endereco,
          numero: req.body.numero,
          uf: req.body.uf,
          cep: req.body.cep,
          bairro: req.body.bairro,
          pacienteId: req.body.pacienteId,
        });

        res.status(200).json(responsavel);
      } catch (err) {
        res.status(500).json({ mensagem: "Erro ao criar responsável", erro: err.message });
      }
    } else {
      res.status(400).json({ mensagem: "Responsável existente" });
    }
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao buscar responsável", erro: err.message });
  }
}

/**
 * @swagger
 * /responsaveis/{id}:
 *   put:
 *     summary: Atualiza um responsável pelo ID.
 *     tags: [Responsavel]
 *     description: Endpoint para atualizar um responsável pelo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do responsável a ser atualizado.
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
 *               cpf:
 *                 type: string
 *               rg:
 *                 type: string
 *               cidade:
 *                 type: string
 *               endereco:
 *                 type: string
 *               numero:
 *                 type: string
 *               uf:
 *                 type: string
 *               cep:
 *                 type: string
 *               bairro:
 *                 type: string
 *               pacienteId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Objeto responsável atualizado.
 *       400:
 *         description: Responsável não encontrado.
 *       500:
 *         description: Erro ao atualizar responsável.
 */
async function alter(req, res) {
  try {
    const paciente = await database.pacientes.findOne({
      where: {
        [Op.and]: [
          { nome: req.body.pacienteNome.split(' ')[0] },
          { sobrenome: req.body.pacienteNome.split(' ').slice(1).join(' ') }
        ]
      },
    });

    if (!paciente) {
      return res.status(400).json({ mensagem: "Paciente não encontrado" });
    }

    const verificacao = await database.responsaveis.update(
      {
        nome: req.body.nome,
        sobrenome: req.body.sobrenome,
        cpf: req.body.cpf,
        rg: req.body.rg,
        cidade: req.body.cidade,
        endereco: req.body.endereco,
        numero: req.body.numero,
        uf: req.body.uf,
        cep: req.body.cep,
        bairro: req.body.bairro,
        pacienteId: paciente.id,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    if (verificacao > 0) {
      const responsavel = await database.responsaveis.findByPk(req.params.id);
      const responsavelFormatado = {
        ...responsavel.toJSON(),
        createdAt: formatarDataParaResposta(responsavel.createdAt),
        updatedAt: formatarDataParaResposta(responsavel.updatedAt),
      };
      res.status(200).json(responsavelFormatado);
    } else {
      res.status(400).json({ mensagem: "Responsável inexistente" });
    }
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao buscar responsável", erro: err.message });
  }
}

/**
 * @swagger
 * /responsaveis/{id}:
 *   delete:
 *     summary: Remove um responsável pelo ID.
 *     tags: [Responsavel]
 *     description: Endpoint para remover um responsável pelo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do responsável a ser removido.
 *     responses:
 *       200:
 *         description: Mensagem de sucesso.
 *       500:
 *         description: Erro ao buscar responsável.
 */
async function remove(req, res) {
  try {
    const responsavel = await database.responsaveis.findByPk(req.params.id);

    let nomeResponsavel = responsavel.nome;
    responsavel.destroy();
    res
      .status(200)
      .json({ mensagem: `${nomeResponsavel} excluído com sucesso`, ok: true });
  } catch (err) {
    res
      .status(500)
      .json({ mensagem: "Erro ao buscar responsável", erro: err.message });
  }
}

module.exports = {
  findAll,
  findByName,
  findByPk,
  create,
  alter,
  remove,
};
