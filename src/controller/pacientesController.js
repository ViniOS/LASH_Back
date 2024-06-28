const database = require("../models");
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');
const { format } = require('date-fns');

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

const formatarDataParaResposta = (data) => {
  return format(new Date(data), 'dd/MM/yyyy');
};

async function findAll(req, res) {
  try {
    const token = extrairToken(req); // Extrai o token do cabeçalho Authorization
    if (!token) {
      return res.status(401).json({ mensagem: "Token não fornecido" });
    }

    // Verifica e decodifica o token
    const payload = jwt.verify(token, process.env.PG_SECRET);

    const pacientesArray = await database.pacientes.findAll({
      include: {
        model: database.responsaveis,
        as: "responsavel",
        on: {
          "$pacientes.id$": { [Op.col]: "responsavel.pacienteId" },
        },
      },
    });

    const pacientesFormatados = pacientesArray.map(paciente => ({
      ...paciente.toJSON(),
      dataNascimento: formatarDataParaResposta(paciente.dataNascimento),
      createdAt: formatarDataParaResposta(paciente.createdAt),
      updatedAt: formatarDataParaResposta(paciente.updatedAt),
    }));

    res.status(200).json(pacientesFormatados);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao buscar pacientes", erro: err.message });
  }
}

async function findByName(req, res) {
  try {
    const token = extrairToken(req); // Extrai o token do cabeçalho Authorization
    if (!token) {
      return res.status(401).json({ mensagem: "Token não fornecido" });
    }

    // Verifica e decodifica o token
    const payload = jwt.verify(token, process.env.PG_SECRET);

    const paciente = await database.pacientes.findAll({
      include: {
        model: database.responsaveis,
        as: "responsavel",
        on: {
          "$pacientes.id$": { [Op.col]: "responsavel.pacienteId" },
        },
      },
      where: {
        nome: req.params.nome,
      },
    });

    const pacienteFormatado = paciente.map(p => ({
      ...p.toJSON(),
      dataNascimento: formatarDataParaResposta(p.dataNascimento),
      createdAt: formatarDataParaResposta(p.createdAt),
      updatedAt: formatarDataParaResposta(p.updatedAt),
    }));

    res.status(200).json(pacienteFormatado);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao buscar paciente", erro: err.message });
  }
}

async function findByPk(req, res) {
  try {
    const token = extrairToken(req); // Extrai o token do cabeçalho Authorization
    if (!token) {
      return res.status(401).json({ mensagem: "Token não fornecido" });
    }

    // Verifica e decodifica o token
    const payload = jwt.verify(token, process.env.PG_SECRET);

    const paciente = await database.pacientes.findByPk(req.params.id);

    const pacienteFormatado = {
      ...paciente.toJSON(),
      dataNascimento: formatarDataParaResposta(paciente.dataNascimento),
      createdAt: formatarDataParaResposta(paciente.createdAt),
      updatedAt: formatarDataParaResposta(paciente.updatedAt),
    };

    res.status(200).json(pacienteFormatado);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao buscar paciente", erro: err.message });
  }
}

async function create(req, res) {
  try {
    const token = extrairToken(req); // Extrai o token do cabeçalho Authorization
    if (!token) {
      return res.status(401).json({ mensagem: "Token não fornecido" });
    }

    // Verifica e decodifica o token
    const payload = jwt.verify(token, process.env.PG_SECRET);

    const verificacao = await database.pacientes.findAll({
      where: {
        cpf: req.body.cpf,
      },
    });

    if (verificacao.length === 0) {
      try {
        const paciente = await database.pacientes.create({
          nome: req.body.nome,
          sobrenome: req.body.sobrenome,
          cpf: req.body.cpf,
          endereco: req.body.endereco,
          doenca: req.body.doenca,
          dataNascimento: formatarData(req.body.dataNascimento), // Conversão da data
          cidade: req.body.cidade,
          numero: req.body.numero,
          uf: req.body.uf,
          cep: req.body.cep,
          bairro: req.body.bairro,
        });

        res.status(200).json(paciente);
      } catch (err) {
        res.status(500).json({ mensagem: "Erro ao criar paciente", erro: err.message });
      }
    } else {
      res.status(500).json({ mensagem: "Paciente existente" });
    }
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao buscar paciente", erro: err.message });
  }
}

async function alter(req, res) {
  try {
    const token = extrairToken(req); // Extrai o token do cabeçalho Authorization
    if (!token) {
      return res.status(401).json({ mensagem: "Token não fornecido" });
    }

    // Verifica e decodifica o token
    const payload = jwt.verify(token, process.env.PG_SECRET);

    const verificacao = await database.pacientes.update(
      {
        nome: req.body.nome,
        sobrenome: req.body.sobrenome,
        cpf: req.body.cpf,
        endereco: req.body.endereco,
        doenca: req.body.doenca,
        dataNascimento: formatarData(req.body.dataNascimento), // Conversão da data
        cidade: req.body.cidade,
        numero: req.body.numero,
        uf: req.body.uf,
        cep: req.body.cep,
        bairro: req.body.bairro,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    if (verificacao > 0) {
      const paciente = await database.pacientes.findByPk(req.params.id);
      res.status(200).json(paciente);
    } else {
      res.status(200).json({ mensagem: "Paciente inexistente" });
    }
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao buscar paciente", erro: err.message });
  }
}

async function remove(req, res) {
  try {
    const token = extrairToken(req); // Extrai o token do cabeçalho Authorization
    if (!token) {
      return res.status(401).json({ mensagem: "Token não fornecido" });
    }

    // Verifica e decodifica o token
    const payload = jwt.verify(token, process.env.PG_SECRET);

    let verify = null;

    if (verify == null) {
      verify = await database.responsaveis.findAll({
        where: {
          pacienteId: req.params.id,
        },
      });
    }

    if (verify.length === 0) {
      verify = await database.frequencia.findAll({
        where: {
          pacienteId: req.params.id,
        },
      });
    }

    if (verify.length === 0) {
      verify = await database.historicoDoencas.findAll({
        where: {
          pacienteId: req.params.id,
        },
      });
    }

    if (verify.length === 0) {
      const paciente = await database.pacientes.findByPk(req.params.id);

      let nomePaciente = paciente.nome;
      paciente.destroy();
      res.status(200).json({ mensagem: `${nomePaciente} excluído com sucesso`, ok: true });
    } else {
      res.status(200).json({ mensagem: `Paciente não pode ser exluído no momento`, ok: false });
    }
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao buscar paciente", erro: err.message });
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
