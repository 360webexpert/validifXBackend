// routes/otpRoutes.js
module.exports = app => {
    const userController = require('../controllers/userController');
    var router = require("express").Router();

    // Route to send OTP
    router.post('/sendOTP', userController.sendOTP);

    // Route to validate OTP
    router.post('/validateOTP', userController.validateOTP);

    app.use('/api', router);
};