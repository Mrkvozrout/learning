require('dotenv').config()

module.exports = {
  port: process.env.PORT || 3000,
  mongoConnectionUri: process.env.MONGO_CONNECTION_URI,
  mongoUsername: process.env.MONGO_USERNAME,
  mongoPassword: process.env.MONGO_PASSWORD,
  encryptionSecret: process.env.ENC_SEC,
  sessionSecret: process.env.SESSION_SEC,
  env: process.env.NODE_ENV || 'production',
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  facebookClientId: process.env.FACEBOOK_CLIENT_ID,
  facebookClientSecret: process.env.FACEBOOK_CLIENT_SECRET
}
