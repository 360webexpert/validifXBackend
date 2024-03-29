// routes/organizationRoutes.js

module.exports = app => {
  const organizationController = require('../controllers/OrganizationController');
  var router = require("express").Router();
  const express = require("express")
  router.post('/createorganization', organizationController.createOrganization);
  router.get('/getorganizationdetails', organizationController.getOrganizationDetails);
  router.post('/createuser', organizationController.createUser);
  router.post('/loginorganization', organizationController.login);
  router.post('/contactorganization', organizationController.contactUs);
  router.post('/orgcheckout', organizationController.createOrgCheckout);
  router.post('/stripesubscription', organizationController.createSubscription);
  router.post('/webhook',organizationController.stripehooks)
  router.get('/getUserSubscription',organizationController.getuserSubscription)


  router.get('/getallorganizations', organizationController.getAllOrganizationDetails);
  // Route to get all users
  router.get('/organizationusers', organizationController.getAllUsers);


  // Route to get user by ID
  router.get('/users/:id', organizationController.getUserById);

  app.use('/api', router);
};



