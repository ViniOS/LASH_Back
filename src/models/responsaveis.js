'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class responsaveis extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      responsaveis.hasMany(models.pacientes, {
        foreignKey: 'id',
        as: 'paciente',
      });
    }
  }
  responsaveis.init({
    nome: DataTypes.STRING,
    sobrenome: DataTypes.STRING,
    cpf: DataTypes.STRING,
    rg: DataTypes.STRING,
    pacienteId: DataTypes.INTEGER,
    cidade: DataTypes.STRING,
    endereco: DataTypes.STRING,
    numero: DataTypes.STRING,
    uf: DataTypes.STRING,
    cep: DataTypes.STRING,
    bairro: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'responsaveis',
  });
  return responsaveis;
};
