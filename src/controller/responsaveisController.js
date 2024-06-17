const database = require("../models");
const { Op } = require("sequelize");

const formatarData = (date) => {
  const [dia, mes, ano] = date.split("/");
  return `${ano}-${mes}-${dia}`;
};

async function findAll(req, res) {
  // #swagger.tags = ['Responsavel']
  // #swagger.description = 'Endpoint para pesquisar todos os responsaveis.'
  try {
    const responsaveisArray = await database.responsaveis.findAll({
      include: {
        model: database.pacientes,
        as: "paciente",
        on: {
          "$responsaveis.pacienteId$": { [Op.col]: "paciente.id" },
        },
      },
    });
    res.status(200).json(responsaveisArray);
  } catch (err) {
    res
      .status(500)
      .json({ mensagem: " Erro ao buscar responsáveis", erro: err.message });
  }
}

async function findByName(req, res) {
  // #swagger.tags = ['Responsavel']
  // #swagger.description = 'Endpoint para pesquisar um responsavel por nome.'

  try {
    const responsavel = await database.responsaveis.findAll({
      include: {
        model: database.pacientes,
        as: "paciente",
        on: {
          "$responsaveis.pacienteId$": { [Op.col]: "paciente.id" },
        },
      },
      where: {
        nome: req.params.nome,
      },
    });
    res.status(200).json(responsavel);
  } catch (err) {
    res
      .status(500)
      .json({ mensagem: " Erro ao buscar responsável", erro: err.message });
  }
}

async function findByPk(req, res) {
  // #swagger.tags = ['Responsavel']
  // #swagger.description = 'Endpoint para pesquisar um responsavel por ID.'

  try {
    const doenca = await database.responsaveis.findByPk(req.params.id);
    res.status(200).json(doenca);
  } catch (err) {
    res
      .status(500)
      .json({ mensagem: " Erro ao buscar doenças", erro: err.message });
  }
}

async function create(req, res) {
    // #swagger.tags = ['Responsavel']
    // #swagger.description = 'Endpoint para criar um responsavel.'
  
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
            pacienteId: req.body.pacienteId
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
        res.status(200).json(responsavel);
      } else {
        res.status(200).json({ mensagem: "Responsável inexistente" });
      }
    } catch (err) {
      res.status(500).json({ mensagem: "Erro ao buscar responsável", erro: err.message });
    }
  }

async function remove(req, res) {
  // #swagger.tags = ['Responsavel']
  // #swagger.description = 'Endpoint para remover um responsavel por ID.'

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
      .json({ mensagem: " Erro ao buscar responsável", erro: err.message });
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
