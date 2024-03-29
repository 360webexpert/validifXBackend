// controllers/organizationController.js
const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');
const db = require('../model');
const Organization = db.organization;
const ContactUs = db.contactus; 
const userdocument = db.document;

const User = db.user;
const express = require("express")
const sendEmail = require('../utils/email');
const authenticateToken = require('../utils/authMiddleware');
const { TOKEN_SECRET, STRIPE_PUBLICKEY, STRIPE_SECRETKEY } = require('../config');

// const stripe = require('stripe')(STRIPE_SECRETKEY)
const stripe = require('stripe')('sk_test_51Or7PQAj9YMnUKIQkGMQN2L5jh79XgHUo53SmnxqXq9PxDRsQ4XaYvlwDOyoNz6DKGmvgnwF1uW10kgEWGsHo9T600tNmLfQu8');
// const stripe = require('stripe')('sk_test_51NSC2RG2Wbd3ToRcBK1Qh9gXluXlksvwD08PLoMjOBviu2fDJblf1JQ0pikI1TNYKHjsvuB98Ow4lVZunsx4PF1800vS1dAlJv');

exports.createOrganization = async (req, res) => {
  try {
    const { name, email, cardNumber, expiryDate, transactionId, planPrice, address, country, state, city } = req.body;
console.log(req.body,"jjjjjjjjj")
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

// getAllOrganizationDetails

//   exports.getAllOrganizationDetails = [
//     authenticateToken, async (req, res) => { 
//         try {
//             // Fetch all organizations from the database
//             const organizations = await Organization.findAll();


//             if (organizations.length === 0) {
//                 return res.status(404).json({ message: 'No organizations found' });
//             }


//             res.status(200).json({ organizations });
//         } catch (error) {
//             console.error("Error fetching all organizations:", error);


//             if (error.name === 'SequelizeDatabaseError') {
//                 return res.status(500).json({ message: 'Database error occurred' });
//             }


//             res.status(500).json({ message: 'Error fetching all organizations' });
//         }
//     }
// ];


exports.getAllOrganizationDetails = async (req, res) => {
  try {
    // Fetch all organizations from the database
    const organizations = await Organization.findAll();

    if (organizations.length === 0) {
      return res.status(404).json({ message: 'No organizations found' });
    }

    res.status(200).json({ organizations });
  } catch (error) {
    console.error("Error fetching all organizations:", error);

    if (error.name === 'SequelizeDatabaseError') {
      return res.status(500).json({ message: 'Database error occurred' });
    }

    res.status(500).json({ message: 'Error fetching all organizations' });
  }
};




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
    const documents = await userdocument.findAll(); // Assuming you have a Document model
    console.log('documentsdadssa', documents.find(doc => doc.userId)) // Debugging

    // Iterate through each user
    const usersWithDocuments = users.map(user => {
      // Find the document corresponding to the user's userId
      const document = documents.find(doc => doc.userId === user.id);

      // If document is found, append it to the user object
      if (document) {
        user.document = document;
      }

      return user;
    });
console.log('userWithDocuments', usersWithDocuments)
    res.status(200).json(usersWithDocuments);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
}];


// Controller function to get user by ID
exports.getUserById =  async (req, res) => {
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
}

exports.contactUs = async (req, res) => {
  try {
    const { subject, email, phoneNumber, description } = req.body;

    await ContactUs.create({ subject, email, phoneNumber, description });

    // Send the contact us email
    await sendContactUsEmail(subject, email, phoneNumber, description);

    return res.status(200).send({ status: 200, message: "Application submitted successfully, our executive will contact you soon" });
  } catch (error) {
    console.error("Error creating on contact organization:", error);
    return res.status(500).send("Error creating on contact organization.");
  }
}

async function createCustomer(email) {
  const customer = await stripe.customers.create({
    email: email,

  });
  console.log('customer', customer)

  return customer;

}


// exports.createOrgCheckout = async (req, res) => {
//   try {
//     // Validate required fields
//     const { zip, currency, name, email, token, amount, address, country, state, city, userId } = req.body;

//     if (!zip || !currency || !name || !email || !token || !amount || !address || !country || !state || !city) {
//       return res.status(400).send({
//         message: "All required fields must be provided in the request body."
//       });
//     }



//     // Find organization by userId if it's provided
//     let organization;
//     if (userId) {
//       organization = await Organization.findOne({
//         where: { userId }
//       });

//       if (!organization) {
//         return res.status(404).send({
//           message: "Organization not found for the given userId."
//         });
//       }
//     }

//     // Create payment method
//     const paymentMethod = await stripe.paymentMethods.create({
//       type: 'card',
//       card: {
//         token: token,
//       },
//     });

//     console.log('Customer created or retrieved:', customer.id);
//     // Attach the payment method to the customer
//     await stripe.paymentMethods.attach(paymentMethod.id, {
//       customer: customer.id,
//     });

//     // Set the payment method as the default for invoices
//     await stripe.customers.update(customer.id, {
//       invoice_settings: {
//         default_payment_method: paymentMethod.id,
//       },
//     });

//     // Create a PaymentIntent using the PaymentMethod
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency,
//       payment_method: paymentMethod.id,
//       description: `Payment for ${name}'s purchase`,
//       shipping: {
//         name: name,
//         address: {
//           line1: address,
//           postal_code: zip,
//           city: city,
//           state: state,
//           country: country,
//         },
//       },
//       customer: customer.id,
//       metadata: {
//         customerName: name,
//         email: email,
//         organizationId: organization ? organization._id : null,
//       },
//     });

//     console.log('paymentIntent', paymentIntent);

//     if (paymentIntent) {
//       try {
//         const password = generateRandomPassword();
       
//         const hashedPassword = await bcrypt.hash(password, 10);
       
//         const organization = await Organization.create({ zip, currency, name, email, token, amount, address, country, state, city, userId, password });
       
//         await sendPasswordByEmail(email, password);
//         return res.status(201).send({ clientSecret: paymentIntent.client_secret, message: "Organization created successfully. Password sent to email." });
//       } catch (emailError) {
//         console.error('Error sending email:', emailError.message);
//         return res.status(500).send({ error: `Error sending email: ${emailError.message}` });
//       }
//     }

   
//   } catch (error) {
//     console.error('Error creating PaymentIntent:', error.message);
//     return res.status(500).send({ error: error.message });
//   }
// };


exports.createOrgCheckout = async (req, res) => {
  try {
    // Validate required fields
    const { subscriptionId,customerId,paymentIntentId,planInterval,planDescription,quantity,zip, currency, name, email, amount, address, country, state, city} = req.body;

    if (!zip || !currency || !name || !email || !amount || !address || !country || !state || !city) {
      return res.status(400).send({
        message: "All required fields must be provided in the request body."
      });
    }

    // Generate a random password
    const password = generateRandomPassword();
   
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
   
    // Create the organization
    const newOrganization = await Organization.create({  subscriptionId,customerId,paymentIntentId,planInterval,planDescription,quantity,zip, currency, name, email, amount, address, country, state, city,password });

    // Send password to email
    await sendPasswordByEmail(email, password);
    
    // Return the newly created organization without token
    return res.status(201).json({ organization: newOrganization, message: "Organization created successfully. Password sent to email." });
   
  } catch (error) {
    console.error('Error creating organization:', error.message);
    return res.status(500).json({ error: error.message });
  }
};



exports.createSubscription = async (req, res) => {
  // createSubscriptionss()
  try {
    if (req.method != "POST") return res.status(400);
    const { name, email, paymentMethod,address ,price_id} = req.body;
    // Create a customer
    console.log('req.body', req.body)
    const customer = await stripe.customers.create({
      email,
      name,
      address,
      payment_method: paymentMethod,
      invoice_settings: { default_payment_method: paymentMethod },
    });
    console.log('customer', customer)
    
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price:price_id,
          },
        
      ],

      payment_settings: {
        payment_method_types: ["card"],
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice.payment_intent"],
    });
    console.log('subscriptionasads', subscription.latest_invoice.payment_intent.client_secret)
    // Send back the client secret for payment
    res.json({
      message: "Subscription successfully initiated",
      // clientSecret: subscription.latest_invoice.payment_intent.client_secret,
            clientSecret: subscription.latest_invoice,


    });
    console.log('res', res)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }

  
}









function updateSubscription() {
  stripe.subscriptions.update(
    subscription.id,
    {
      // set cancel at to 12 months from now
      cancel_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 * 12,
    },
  );
}

exports.stripehooks = async (request, response) => {

  // const sig = request.headers['stripe-signature'];
  const sig = 'whsec_4PNNErrOwub5Gb6x2gmfA65oPN6hHe3g'

  console.log('sig', sig)
  const endpointSecret = "we_1OtU2wSEL02qr6meQQTPxU6g";
  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    console.log('event', event)
  } catch (err) {
    console.log(err);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'invoice.created':
      var invoice = event.data.object;
      console.log(`Invoice ${invoice.id} was created!`);
      break;
    case 'invoice.paid':
      var invoice = event.data.object;
      console.log(`Invoice ${invoice.id} was paid!`);
      break;
    case 'invoice.payment_failed':
      var invoice = event.data.object;
      console.log(`Invoice ${invoice.id} failed to pay!`);
      break;
    case 'subscription_schedule.created':
      var subscription_schedule = event.data.object;
      console.log(`Subscription schedule ${subscription_schedule.id} was created!`);
    // Subscription created for customer
    case 'customer.subscription.created':
      var subscription = event.data.object;
      console.log(`Subscription ${subscription.id} was created!`);
      // Update the subscription to cancel at the end of the current period
      updateSubscription();
      break;
    // Recurring payment will come through here
    case 'customer.subscription.updated':
      var subscription = event.data.object;
      console.log(subscription);
      console.log(`Subscription ${subscription.id} was updated!`);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

}


// exports.createSubscription = async (req, res) => {

//   const { email } = req.body
//   const result = await createCustomer(email)
//   console.log('result', result)
//   const priceId = "price_1Orfn8SEL02qr6mepdDLMpTx"
//   // const {priceId,customerId} = req.body
//   const session = await stripe.checkout.sessions.create({
//     mode: 'subscription',
//     line_items: [
//       {
//         price: priceId,
//         quantity: 1,
//       },
//     ],
//     customer: result.id,
//     success_url: 'http://localhost:3000/success',
//     cancel_url: 'http://localhost:3000/cancel',
//   });

//   res.send({
//     session_url: session
//   })
//   console.log('session', session)
// }

exports.getuserSubscription = async (req, res) => {
  // First, retrieve the customer using the email address
  const customer = await stripe.customers.list({ email: 'test123@gmail.com', limit: 1 });
  console.log('customer', customer)
  // If the customer exists, fetch their subscriptions
  if (customer.data.length > 0) {
    const customerId = customer.data[0].id;
    console.log('customerId', customerId)
    const subscriptions = await stripe.subscriptions.list({ customer: customerId });

    // Now you have the list of subscriptions associated with the customer
    console.log(subscriptions, "subscriptions");
    return res.status(200).json({ data: subscriptions })
  } else {
    // Handle case where customer doesn't exist
    console.log('Customer not found');
  }
}




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




























