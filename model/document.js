module.exports = (sequelize, Sequelize) => {
    const document = sequelize.define('document', {
        issuingStateCode: {
            type: Sequelize.STRING,
            allowNull: true
        },
        documentNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        dateofExpiry: {
            type: Sequelize.DATE,
            allowNull: true
        },
        dateofIssue: {
            type: Sequelize.DATE,
            allowNull: true
        },
        dateofBirth: {
            type: Sequelize.DATE,
            allowNull: true
        },
        placeofBirth: {
            type: Sequelize.STRING,
            allowNull: true
        },
        surname: {
            type: Sequelize.STRING,
            allowNull: true
        },
        givenName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        nationality: {
            type: Sequelize.STRING,
            allowNull: true
        },
        sex: {
            type: Sequelize.STRING,
            allowNull: true
        },
        issuingAuthority: {
            type: Sequelize.STRING,
            allowNull: true
        },
        surnameandGivenNames: {
            type: Sequelize.STRING,
            allowNull: true
        },
        nationalityCode: {
            type: Sequelize.STRING,
            allowNull: true
        },
        issuingState: {
            type: Sequelize.STRING,
            allowNull: true
        },
        middleName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        age: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        monthsToExpire: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        ageAtIssue: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        yearsSinceIssue: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        passportNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        companyName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        documentClassCode: {
            type: Sequelize.STRING,
            allowNull: true
        },
        address: {
            type: Sequelize.STRING,
            allowNull: true
        },
        similarity: {
            type: Sequelize.STRING,
            allowNull: true
        },
        liveness: {
            type: Sequelize.STRING,
            allowNull: true
        },
        signatureImage: {
            type: Sequelize.STRING,
            allowNull: true
        },
        portraitImage: {
            type: Sequelize.STRING,
            allowNull: true
        },
        documentImage: {
            type: Sequelize.STRING,
            allowNull: true
        },
        barcodeImage: {
            type: Sequelize.STRING,
            allowNull: true
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'users',
              key: 'id'     
            },
        }
    });
    // document.associate = (models) => {
    //     document.belongsTo(models.User, { foreignKey: 'userId' });
    //   };
    return document;
};

