const dbConfig = require("../config/db.js");
// const { UserCourse } = require('./userCourse.model.js');
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.development.database, dbConfig.development.username, dbConfig.development.password, {
  host: dbConfig.development.host,
  dialect: dbConfig.development.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.development.pool.max,
    min: dbConfig.development.pool.min,
    acquire: dbConfig.development.pool.acquire,
    idle: dbConfig.development.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Define your models
db.user = require("./user.js")(sequelize, Sequelize);
db.organization = require("./Organization.js")(sequelize, Sequelize);
db.contactus = require("./contactus.js")(sequelize, Sequelize);
db.document = require("./document.js")(sequelize, Sequelize);

// db.addCourse = require("./AdminMode/admincourse.model.js")(sequelize, Sequelize);
// db.createusercheckout = require("./usercheckout.model.js")(sequelize, Sequelize);
// db.userCourse = require("./userCourse.model.js")(sequelize, Sequelize);







module.exports = db;    