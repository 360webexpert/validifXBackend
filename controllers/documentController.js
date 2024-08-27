
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const db = require('../model');
const db = require('../model')
const document = db.document
const user = db.user
const authenticateToken = require('../utils/authMiddleware');
const moment = require('moment');
exports.documentuser = async (req, res) => {
    try {
        const {
            issuingStateCode = '',
            documentNumber = '',
            dateofExpiry = '',
            dateofIssue = '',
            dateofBirth = '',
            placeofBirth = '',
            surname = '',
            givenName = '',
            nationality = '',
            sex = '',
            issuingAuthority = '',
            surnameandGivenNames = '',
            nationalityCode = '',
            issuingState = '',
            middleName = '',
            age = '',
            monthsToExpire = '',
            ageAtIssue = '',
            yearsSinceIssue = '',
            passportNumber = '',
            companyName = '',
            documentClassCode = '',
            address = '',
            similarity = '',
            liveness = '',
            signatureImage = '',
            portraitImage = '',
            documentImage = '',
            barcodeImage = '',
            userId=''
        } = req.body;

        // Validate and format dates
        const formatDate = (dateStr) => {
            return moment(dateStr, 'YYYY-MM-DD', true).isValid() ? moment(dateStr).format('YYYY-MM-DD') : null;
        };

        const formattedDateofExpiry = formatDate(dateofExpiry);
        const formattedDateofIssue = formatDate(dateofIssue);
        const formattedDateofBirth = formatDate(dateofBirth);

        if (!formattedDateofExpiry || !formattedDateofIssue || !formattedDateofBirth) {
            return res.status(400).json({
                error: 'Invalid date format. Dates must be in YYYY-MM-DD format.',
                success: false,
            });
        }

        const documentUser = await document.create({
            issuingStateCode,
            documentNumber,
            dateofExpiry: formattedDateofExpiry,
            dateofIssue: formattedDateofIssue,
            dateofBirth: formattedDateofBirth,
            placeofBirth,
            surname,
            givenName,
            nationality,
            sex,
            issuingAuthority,
            surnameandGivenNames,
            nationalityCode,
            issuingState,
            middleName,
            age,
            monthsToExpire,
            ageAtIssue,
            yearsSinceIssue,
            passportNumber,
            companyName,
            documentClassCode,
            address,
            similarity,
            liveness,
            signatureImage,
            portraitImage,
            documentImage,
            barcodeImage,
            userId
        });

        res.status(200).json({
            message: 'Document user created successfully',
            document: documentUser,
            status: 'completed',
        });
    } catch (error) {
        console.error('Error creating document user:', error);

        res.status(500).json({
            error: 'Error creating document user',
            success: false,
        });
    }
}



exports.getAllDocumentUsers = async (req, res) => {
    try {

        const allDocumentUsers = await document.findAll({
            include:[{
                model:user
            }]
    });


        res.status(200).json({
            message: 'All document users retrieved successfully',
            documentUsers: allDocumentUsers,
            status: 'completed',
        });
    } catch (error) {
        // Handle errors
        console.error('Error fetching document users:', error);
        res.status(500).json({
            error: 'Error fetching document users',
            success: false,
        });
    }
}

