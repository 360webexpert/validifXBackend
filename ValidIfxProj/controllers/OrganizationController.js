// controllers/organizationController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../model');
const Organization = db.organization;
const User = db.user;
const sendEmail = require('../utils/email');
const authenticateToken = require('../utils/authMiddleware');
const { TOKEN_SECRET } = require('../config');


exports.createOrganization = async (req, res) => {
    try {
        const { name, email, cardNumber, expiryDate, transactionId, planPrice } = req.body;

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
        const organization = await Organization.create({ name, email, cardNumber, expiryDate, transactionId, planPrice, password });
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
        }else{

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
    authenticateToken,async (req, res) => {
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
exports.getAllUsers =[authenticateToken, async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
}];

// Controller function to get user by ID
exports.getUserById = [authenticateToken,async (req, res) => {
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

function generateRandomPassword() {
    // Generate a random 8-character alphanumeric password
    return Math.random().toString(36).slice(-8);
}

async function sendPasswordByEmail(email, password) {
    const subject = 'Your Organization Password';
    const text = `Your password for the organization is: ${password}`;

    const emailSent = await sendEmail(email, subject, text);
    if (emailSent) {
        console.log('Password sent successfully to:', email);
    } else {
        console.error('Failed to send password email to:', email);
    }
}


