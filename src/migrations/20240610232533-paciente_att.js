'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('pacientes', 'numero', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('pacientes', 'uf', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('pacientes', 'cep', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('pacientes', 'bairro', {
      type: Sequelize.STRING,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('pacientes', 'numero');
    await queryInterface.removeColumn('pacientes', 'uf');
    await queryInterface.removeColumn('pacientes', 'cep');
    await queryInterface.removeColumn('pacientes', 'bairro');
  }
};