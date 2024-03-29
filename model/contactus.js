

module.exports = (sequelize, Sequelize) => {
  const ContactUs = sequelize.define('ContactUs', {
   
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    subject: {
      type: Sequelize.STRING,
      allowNull: false
    },
    phoneNumber: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    },
   
  });

  
  
  return ContactUs;
};
