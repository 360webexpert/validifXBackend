
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const db = require('../model');
const db = require('../model')
const document = db.document
const authenticateToken = require('../utils/authMiddleware');


exports.documentuser = async (req, res) => {
    try {
        const { addressCity, addressCountryCode, addressPostalCode, addressStreet1, addressStreet2, addressSubdivision, birthdate, currentGovernmentId, currentSelfie, emailAddress, expirationDate, identificationClass, identificationNumber, nameFirst, nameLast, nameMiddle, phoneNumber, selectedCountryCode, selectedIdClass ,inquiryId,status,userId} = req.body;

        const documentUser = await document.create({
            addressCity, addressCountryCode, addressPostalCode, addressStreet1, addressStreet2, addressSubdivision, birthdate, currentGovernmentId, currentSelfie, emailAddress, expirationDate, identificationClass, identificationNumber, nameFirst, nameLast, nameMiddle, phoneNumber, selectedCountryCode, selectedIdClass,inquiryId,status,userId
        });

        res.status(200).json({
            message: 'document user created successfully',
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



exports.getAllDocumentUsers =  async (req, res) => {         
    try {
       
        const allDocumentUsers = await document.findAll();

       
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

