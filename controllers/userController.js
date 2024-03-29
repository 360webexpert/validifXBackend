// controllers/otpController.js
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const db = require('../model')
const User = db.user;
const { TOKEN_SECRET, STRIPE_PUBLICKEY, STRIPE_SECRETKEY } = require('../config');
const authenticateToken = require('../utils/authMiddleware');
// Initialize Twilio client with your Account SID and Auth Token
const client = twilio('AC745968fa7cdba3f206db0304f14bbebe', '9b171d10e687b2079c5f4a9c63fd2851');

// Generate OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
}

// Temporary storage for OTP
const otpMap = new Map();

// Send OTP to user's phone number
// exports.sendOTP = async (req, res) => {
//     const { phoneNumber } = req.body;

//     try {
//         // Check if the user exists
//         let user = await User.findOne({ where: { phoneNumber } });
//         if (!user) {
//             return res.status(404).json({ message: 'Mobile number not registered' });
//         }else{

//         // Generate new OTP
//         // const otp = generateOTP();
//         const otp = 123456
//         // const from = '+12674634732'; // Update with your Twilio phone number
//         // const to = phoneNumber;
//         // const body = `Your OTP is ${otp}`;

//         // Store OTP temporarily
//         // otpMap.set(phoneNumber, otp);

//         // Send OTP via Twilio
//         // client.messages.create({
//         //     body: body,
//         //     from: from,
//         //     to: to
//         // }).then((twilioRes) => {
//             // Handle Twilio response
//             // console.log('Twilio response:', twilioRes);
//             return res.status(200).json({ success: true, message: 'OTP sent successfully' ,otp:otp});
//         // }).catch((error) => {
//         //     console.error('Error sending OTP:', error);
//         //     return res.status(500).json({ success: false, message: 'Error sending OTP' });
//         // });
//     }
//     } catch (error) {
//         console.error('Error sending OTP:', error);
//         return res.status(500).json({ success: false, message: 'Error sending OTP' });
//     }
// };


exports.validateUser = async (req, res) => {
    const { phoneNumber } = req.body;
console.log('object', req.body)
    try {
        // Check if the user exists
        let user = await User.findOne({ where: { phoneNumber } });
        
        if (!user) {
            return res.status(404).json({ message: 'Mobile number not registered' });
        } else {

            // Generate JWT token

            const token = jwt.sign({ id: user?.id, phoneNumber: user?.phoneNumber }, TOKEN_SECRET);
            return res.status(200).json({ success: true, message: 'successfully', token });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: 'Error occurred while processing request' });
    }
};


exports.getUserByToken = [
    authenticateToken, async (req, res) => {

        const id = req.userId // Extracting token from headers

        console.log(id, "jklsdm");

       

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
    }
];

exports.updateUser = [authenticateToken, async (req,res) => {

    const userId = req.userId; // Extract user ID from the authenticated token

    try {
        // Find the user by ID
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user information based on the request body
        user.isVerified = req.body.isVerified || user.isVerified;
        

        // Save the updated user object
        await user.save();

        res.status(200).json({ message: 'User information updated successfully', user });
    } catch (error) {
        console.error('Error updating user information:', error);
        res.status(500).json({ message: 'Error updating user information' });
    }
}]
// Validate OTP
exports.validateOTP = async (req, res) => {
    const { phoneNumber, receivedotp } = req.body;

    try {
        const user = await User.findOne({ where: { phoneNumber } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Retrieve stored OTP
        const storedOTP = otpMap.get(phoneNumber);

        if (receivedotp === storedOTP) {
            // Remove OTP from storage after successful validation
            otpMap.delete(phoneNumber);
            return res.json({ success: true, message: 'OTP validated successfully' });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error('Internal server error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};