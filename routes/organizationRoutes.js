// routes/organizationRoutes.js

module.exports = app => {
  const organizationController = require('../controllers/OrganizationController');
  var router = require("express").Router();

  router.post('/createorganization', organizationController.createOrganization);
  router.get('/getorganizationdetails', organizationController.getOrganizationDetails);
  router.post('/createuser', organizationController.createUser);
  router.post('/loginorganization', organizationController.login);
  // Route to get all users
  router.get('/users', organizationController.getAllUsers);

  // Route to get user by ID
  router.get('/users/:id', organizationController.getUserById);

  app.use('/api', router);
};