// routes/otpRoutes.js
module.exports = app => {
    const userController = require('../controllers/userController');
    var router = require("express").Router();

    // Route to send OTP
    router.post('/validateuser', userController.validateUser);

    // Route to validate OTP
    router.post('/validateOTP', userController.validateOTP);
    router.get('/user', userController.getUserByToken);
    router.put('/updateuser', userController.updateUser);

    app.use('/api', router);
};