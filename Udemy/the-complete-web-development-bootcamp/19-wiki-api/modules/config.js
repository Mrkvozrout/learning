require('dotenv').config()

module.exports = {
  port: process.env.PORT || 3000,
  mongoConnectionUri: process.env.MONGO_CONNECTION_URI,
  mongoUsername: process.env.MONGO_USERNAME,
  mongoPassword: process.env.MONGO_PASSWORD
}
