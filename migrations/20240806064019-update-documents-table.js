module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('documents');

    // Define fields to be added
    const fieldsToAdd = {
      issuingStateCode: Sequelize.STRING,
      documentNumber: Sequelize.STRING,
      dateofExpiry: Sequelize.DATE,
      dateofIssue: Sequelize.DATE,
      dateofBirth: Sequelize.DATE,
      placeofBirth: Sequelize.STRING,
      surname: Sequelize.STRING,
      givenName: Sequelize.STRING,
      nationality: Sequelize.STRING,
      sex: Sequelize.STRING,
      issuingAuthority: Sequelize.STRING,
      surnameandGivenNames: Sequelize.STRING,
      nationalityCode: Sequelize.STRING,
      issuingState: Sequelize.STRING,
      middleName: Sequelize.STRING,
      age: Sequelize.INTEGER,
      monthsToExpire: Sequelize.INTEGER,
      ageAtIssue: Sequelize.INTEGER,
      yearsSinceIssue: Sequelize.INTEGER,
      passportNumber: Sequelize.STRING,
      companyName: Sequelize.STRING,
      documentClassCode: Sequelize.STRING,
      address: Sequelize.STRING,
      similarity: Sequelize.STRING,
      liveness: Sequelize.STRING,
      signatureImage: Sequelize.STRING,
      portraitImage: Sequelize.STRING,
      documentImage: Sequelize.STRING,
      barcodeImage: Sequelize.STRING,
    };

    for (const [field, type] of Object.entries(fieldsToAdd)) {
      if (!tableInfo[field]) {
        await queryInterface.addColumn('documents', field, {
          type,
          allowNull: true
        });
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    const fieldsToRemove = [
      'issuingStateCode',
      'documentNumber',
      'dateofExpiry',
      'dateofIssue',
      'dateofBirth',
      'placeofBirth',
      'surname',
      'givenName',
      'nationality',
      'sex',
      'issuingAuthority',
      'surnameandGivenNames',
      'nationalityCode',
      'issuingState',
      'middleName',
      'age',
      'monthsToExpire',
      'ageAtIssue',
      'yearsSinceIssue',
      'passportNumber',
      'companyName',
      'documentClassCode',
      'address',
      'similarity',
      'liveness',
      'signatureImage',
      'portraitImage',
      'documentImage',
      'barcodeImage',
    ];

    for (const field of fieldsToRemove) {
      if (tableInfo[field]) {
        await queryInterface.removeColumn('documents', field);
      }
    }
  }
};
