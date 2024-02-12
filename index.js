// index.js

const express = require('express');
const bodyParser = require('body-parser');
const otpRoutes = require('./routes/userRoutes');
const db = require("./model");
const cors = require("cors");
const app = express();
const crypto = require('crypto');

const PORT = process.env.PORT || 5000;


const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
    credentials: true, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };
app.use (cors(corsOptions));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});
app.use(bodyParser.json());

// Generate a random secret key
// const secretKey = crypto.randomBytes(32).toString('hex');
// console.log('Generated Secret Key:', secretKey);

// Use  routes
app.use(express.urlencoded({ extended: true }));


// Sync Sequelize models with the database
db.sequelize.sync({ force: false }).then(async () => {
    console.log('Database synced.');
  })
  .catch(error => {
    console.error('Error syncing database:', error);
  });


require("./routes/userRoutes")(app);
require("./routes/organizationRoutes")(app);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
