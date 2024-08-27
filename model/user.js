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
    },
    isVerified:{
      type: Sequelize.BOOLEAN,
      default: false
    }
  });

  User.associate = (models) => {
    User.belongsTo(models.Organization, { foreignKey: 'organizationId' });
    // User.hasMany(models.Document, { foreignKey: 'userId' })
  };
  return User;
};
