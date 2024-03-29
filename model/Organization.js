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
  amount: {
      type: Sequelize.FLOAT,
      allowNull: false
  },
  address: {
      type: Sequelize.STRING,
      allowNull: false
  },
  country: {
      type: Sequelize.STRING,
      allowNull: false
  },
  state: {
      type: Sequelize.STRING,
      allowNull: false
  },
  city: {
      type: Sequelize.STRING,
      allowNull: false
  },
  currency: {
      type: Sequelize.STRING,
      allowNull: false
  },
  zip: {
      type: Sequelize.STRING,
      allowNull: false
  },
  password: {
      type: Sequelize.STRING,
      allowNull: false
  },
  subscriptionId: {
      type: Sequelize.STRING,
      allowNull: false // Depending on your business logic, this might be true or false
  },
  customerId: {
      type: Sequelize.STRING,
      allowNull: false
  },
  paymentIntentId: {
      type: Sequelize.STRING,
      allowNull: false
  },
  planInterval: {
      type: Sequelize.STRING,
      allowNull: false
  },
  planDescription: {
      type: Sequelize.STRING,
      allowNull: false
  },
  quantity: {
      type: Sequelize.INTEGER,
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
