module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('User', {
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    phoneNumber: {
      type: Sequelize.STRING,
      allowNull: false
    },
    organizationId:{
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  User.associate = (models) => {
    User.belongsTo(models.Organization, { foreignKey: 'organizationId' });
  };

  return User;
};
