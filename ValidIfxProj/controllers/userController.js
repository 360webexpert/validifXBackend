// controllers/otpController.js

const twilio = require('twilio');
const db = require('../model')
const  User  = db.user;

// Initialize Twilio client with your Account SID and Auth Token
const client = twilio('AC745968fa7cdba3f206db0304f14bbebe', 'e59fb4bd94134c60689e629d8c3c1a71');

// Generate OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
}

// Temporary storage for OTP
const otpMap = new Map();

// Send OTP to user's phone number
exports.sendOTP = async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        // Check if the user exists
        let user = await User.findOne({ where: { phoneNumber } });
        if (!user) {
            return res.status(404).json({ message: 'Mobile number not registered' });
        }else{

        // Generate new OTP
        const otp = generateOTP();
        const from = '+12674634732'; // Update with your Twilio phone number
        const to = phoneNumber;
        const body = `Your OTP is ${otp}`;

        // Store OTP temporarily
        otpMap.set(phoneNumber, otp);

        // Send OTP via Twilio
        client.messages.create({
            body: body,
            from: from,
            to: to
        }).then((twilioRes) => {
            // Handle Twilio response
            console.log('Twilio response:', twilioRes);
            return res.status(200).json({ success: true, message: 'OTP sent successfully' });
        }).catch((error) => {
            console.error('Error sending OTP:', error);
            return res.status(500).json({ success: false, message: 'Error sending OTP' });
        });
    }
    } catch (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({ success: false, message: 'Error sending OTP' });
    }
};

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
