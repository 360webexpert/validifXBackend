module.exports = {
  development: {
      host: "localhost",
      username: "root",
      password: "root@123",
      database: "validifx",
      dialect: "mysql",
      pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
      }
  }

  // "test": {
  //   "username": "root",
  //   "password": "Password@1234",
  //   "database": "validifx",
  //   "host": "localhost",
  //   "dialect": "mysql"
  // },
  // "production": {
  //   "username": "root",
  //   "password": null,
  //   "database": "database_production",
  //   "host": "127.0.0.1",
  //   "dialect": "mysql"
  // }
}
