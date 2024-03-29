'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Organizations', 'subscriptionId', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.addColumn('Organizations', 'customerId', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.addColumn('Organizations', 'paymentIntentId', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.addColumn('Organizations', 'planInterval', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.addColumn('Organizations', 'planDescription', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.addColumn('Organizations', 'quantity', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Organizations', 'subscriptionId');
    await queryInterface.removeColumn('Organizations', 'customerId');
    await queryInterface.removeColumn('Organizations', 'paymentIntentId');
    await queryInterface.removeColumn('Organizations', 'planInterval');
    await queryInterface.removeColumn('Organizations', 'planDescription');
    await queryInterface.removeColumn('Organizations', 'quantity');
  }
};
