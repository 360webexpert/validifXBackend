// controllers/organizationController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../model');
const Organization = db.organization;
const ContactUs = db.contactus;
const User = db.user;
const sendEmail = require('../utils/email');
const authenticateToken = require('../utils/authMiddleware');
const { TOKEN_SECRET,STRIPE_PUBLICKEY,STRIPE_SECRETKEY } = require('../config');

const stripe = require('stripe')(STRIPE_SECRETKEY)

exports.createOrganization = async (req, res) => {
    try {
        const { name, email, cardNumber, expiryDate, transactionId, planPrice, address, country, state, city } = req.body;

        // Check if organization with provided email already exists
        const existingOrganization = await Organization.findOne({ where: { email } });
        if (existingOrganization) {
            return res.status(400).json({ message: 'Organization with this email already exists' });
        }

        // Generate a random password
        const password = generateRandomPassword();
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create organization record in the database
        const organization = await Organization.create({ name, email, cardNumber, expiryDate, transactionId, planPrice, address, country, state, city, password });
        // Send the password to the organization's email
        await sendPasswordByEmail(email, password);
        res.status(201).send("Organization created successfully. Password sent to email.");
    } catch (error) {
        console.error("Error creating organization:", error);
        res.status(500).send("Error creating organization.");
    }
}


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('email,password', email, password);

        // Check if organization with provided email exists
        const organization = await Organization.findOne({ where: { email } });
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        // Log the hashed password retrieved from the database
        console.log('Stored hashed password:', organization.password);

        // Check if password is correct
        const passwordMatch = await bcrypt.compare(password, organization.password);
        console.log('passwordMatch', passwordMatch);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        } else {

            // Generate JWT token
            const token = jwt.sign({ id: organization.id, email: organization.email }, TOKEN_SECRET);
            res.status(200).json({ token: token, data: organization });
        }



        // const token = jwt.sign({ organizationId: organization.id }, TOKEN_SECRET);

        // res.status(200).json({ token });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: 'Error logging in' });
    }
}

exports.getOrganizationDetails = [
    authenticateToken, async (req, res) => {
        try {
            console.log('reqqqqqqq', req)
            // Extract organization ID from decoded token payload
            const organizationId = req.userId;
            console.log('organizationId', organizationId)
            // Fetch organization details from the database
            const organization = await Organization.findByPk(organizationId);

            if (!organization) {
                return res.status(404).json({ message: 'Organization not found' });
            }

            // Return organization details in the response
            res.status(200).json({ organization });
        } catch (error) {
            console.error("Error fetching organization details:", error);
            res.status(500).json({ message: 'Error fetching organization details' });
        }
    }];

exports.createUser = [
    authenticateToken, async (req, res) => {
        try {
            const { username, phoneNumber, organizationId } = req.body;

            // Check if organization with provided ID exists
            const organization = await Organization.findByPk(organizationId);
            if (!organization) {
                return res.status(404).json({ message: 'Organization not found' });
            }

            // Check if the phoneNumber is already registered
            const existingUser = await User.findOne({ where: { phoneNumber } });
            if (existingUser) {
                return res.status(400).json({ message: 'User already registered with the given phone number' });
            }

            // Create user record in the database
            const user = await User.create({ username, phoneNumber, organizationId });
            
            res.status(201).json({ message: 'User created successfully', user });
        } catch (error) {
            console.error("Error creating user:", error);
            res.status(500).json({ message: 'Error creating user' });
        }
    }
];

// Controller function to get all users
exports.getAllUsers = [authenticateToken, async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
}];

// Controller function to get user by ID
exports.getUserById = [authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ message: 'Error fetching user by ID' });
    }
}];

exports.contactUs = async (req, res) => {
    try {
        const { subject, email, phoneNumber, description } = req.body;

        await ContactUs.create({ subject, email, phoneNumber, description });

        // Send the contact us email
        await sendContactUsEmail(subject, email, phoneNumber, description);

        return res.status(200).send({status:200,message:"Application submitted successfully, our executive will contact you soon"});
    } catch (error) {
        console.error("Error creating on contact organization:", error);
        return res.status(500).send("Error creating on contact organization.");
    }
}

exports.createOrgCheckout =  async (req, res) => {
   
    if (!req.body) {
      return res.status(400).send({
        message: "Data must be provided in the request body."
      });
    }
    try {
      const { amount, currency, email, name, address, country, state, city, token, userId,zip } = req.body;
      // Create a PaymentMethod using the token
    //   const existingCheckout = await createusercheckout.findOne({ where: { userId, courseId } });
    //   if (existingCheckout) {
    //     return res.status(400).send({
    //       message: "You have already purchased this course."
    //     });
    //   }
  
      const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          token: token,
        },
      });
      // Create a PaymentIntent using the PaymentMethod
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        payment_method: paymentMethod.id,
        description: `Payment for ${name}'s purchase`,
        shipping: {
          name: name,
          address: {
            line1: address,
            postal_code: zip,
            city: city,
            state: state,
            country: country,
          },
        },
        metadata: {
          customerName: name,
          email: email,
          // You can add more metadata fields as needed
        },
      });
    //   if (paymentIntent) {
    //     // Create the checkout entry
    //     const checkout = await createusercheckout.create({
    //       amount, currency, email, userName, address, country, state, city, Zip, token, courseTitle, courseId, userId
    //     });
    //     console.log('Checkout created:', checkout);
    //   }
      // Send client secret to the frontend
      res.status(201).send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error('Error creating PaymentIntent:', error.message);
      res.status(500).send({ error: error.message });
    }
  };

function generateRandomPassword() {
    // Generate a random 8-character alphanumeric password
    return Math.random().toString(36).slice(-8);
}

async function sendPasswordByEmail(email, password) {
    const subject = 'Welcome to validifY App! Here is your password.';
    const code = `Your password for the organization is: ${password}`;

    const emailSent = await sendEmail.sendEmail(email, subject, code);
    if (emailSent) {
        console.log('Password sent successfully to:', email);
    } else {
        console.error('Failed to send password email to:', email);
    }
}
async function sendContactUsEmail(subject, email, phoneNumber, description) {


    const emailSent = await sendEmail.sendContactUsEmail(subject, email, phoneNumber, description);
    if (emailSent) {
        console.log('email sent successfully to:', email);
    } else {
        console.error('Failed to send contactus email to:', email);
    }
}


