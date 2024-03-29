// index.js

const express = require('express');
const bodyParser = require('body-parser');
const otpRoutes = require('./routes/userRoutes');
const db = require("./model");
const cors = require("cors");
const app = express();
const crypto = require('crypto');
const path = require("path");
const fs = require('fs');
const PORT = process.env.PORT || 8080;

app.set('view engine', 'ejs')
app.set("views", path.join(__dirname, "utils"));
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
app.get ("/", (req, res) => {
  res.json({message: "Welcome"});
  });

// Generate a random secret key
// const secretKey = crypto.randomBytes(32).toString('hex');
// console.log('Generated Secret Key:', secretKey);

// Use  routes
app.use(express.urlencoded({ extended: false }));
	

// Sync Sequelize models with the database
db.sequelize.sync({ force: false }).then(async () => {
  

});



require("./routes/userRoutes")(app);
require("./routes/organizationRoutes")(app);
require("./routes/documentRoutes")(app);
app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`);
});
  