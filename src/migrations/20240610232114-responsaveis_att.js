'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('responsaveis', 'cidade', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('responsaveis', 'endereco', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('responsaveis', 'numero', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('responsaveis', 'uf', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('responsaveis', 'cep', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('responsaveis', 'bairro', {
      type: Sequelize.STRING,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('responsaveis', 'cidade');
    await queryInterface.removeColumn('responsaveis', 'endereco');
    await queryInterface.removeColumn('responsaveis', 'numero');
    await queryInterface.removeColumn('responsaveis', 'uf');
    await queryInterface.removeColumn('responsaveis', 'cep');
    await queryInterface.removeColumn('responsaveis', 'bairro');
  }
};
