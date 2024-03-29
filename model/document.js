

module.exports = (sequelize, Sequelize) => {
    const document = sequelize.define('document', {

        addressCity: {
            type: Sequelize.STRING,
            allowNull: false
        },
        addressCountryCode: {
            type: Sequelize.STRING,
            allowNull: false
        },
        addressPostalCode: {
            type: Sequelize.STRING,
            allowNull: false
        },
        addressStreet1: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        addressStreet2: {
            type: Sequelize.TEXT,
            allowNull: false
        },

        addressSubdivision: {
            type: Sequelize.TEXT,
            allowNull: false
        },

        birthdate: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        currentGovernmentId: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        currentSelfie: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        emailAddress: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        expirationDate: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        identificationClass: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        identificationNumber: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        nameFirst: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        nameLast: {
            type: Sequelize.TEXT,
            allowNull: false
        },

        nameMiddle: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        phoneNumber: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        selectedCountryCode: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        selectedIdClass: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        inquiryId: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
          },
          status: {
            type: Sequelize.STRING,
            allowNull: false
        },
        userId:{
            type: Sequelize.STRING,
            allowNull: true
          },

    });


   



    return document;
};
