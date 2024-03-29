exports.createOrgCheckout =  async (req, res) => {
   
    if (!req.body) {
      return res.status(400).send({
        message: "Data must be provided in the request body."
      });
    }
    console.log(req.body,"jjjjjjj")
    try {
      const { zip, currency, name, email, token, amount, address, country, state, city, userId } = req.body;
     
  
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
   
      res.status(201).send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error('Error creating PaymentIntent:', error.message);
      res.status(500).send({ error: error.message });
    }
  };
