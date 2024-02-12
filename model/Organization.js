const bcrypt = require('bcryptjs');

module.exports = (sequelize, Sequelize) => {
  const Organization = sequelize.define('Organization', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    cardNumber: {
      type: Sequelize.STRING,
      allowNull: false
    },
    expiryDate: {
      type: Sequelize.DATE,
      allowNull: false
    },
    transactionId: {
      type: Sequelize.STRING,
      allowNull: false
    },
    planPrice: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  // Hash password before saving to the database
  Organization.beforeCreate(async (organization) => {
    const hashedPassword = await bcrypt.hash(organization.password, 10);
    organization.password = hashedPassword;
  });

  // Define association with User model
  // Organization.hasMany(User);
  Organization.associate = (models) => {
    Organization.belongsTo(models.User, { foreignKey: 'oragnizationId' });
  };
  
  return Organization;
};
