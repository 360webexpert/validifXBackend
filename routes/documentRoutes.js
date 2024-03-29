// routes/otpRoutes.js
module.exports = app => {
    const documentController = require('../controllers/documentController');
    var router = require("express").Router();

   
    router.post('/document',documentController.documentuser);
    router.get('/getalldocumentUsers',documentController.getAllDocumentUsers);

    

    app.use('/api', router);
};