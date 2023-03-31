const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const appConfig = require('./modules/config.js')
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')
const bcrypt = require('bcrypt')

const saltRounds = 10

// Setup DB

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true
  },
  password: {
    type: String,
    require: true
  }
})
userSchema.plugin(encrypt, { secret: appConfig.encryptionSecret, encryptedFields: ['password'] })

const User = mongoose.model('User', userSchema)


mongoose.connect(appConfig.mongoConnectionUri)


// Setup app

const app = express()
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')


// Request handlers

app.get('/', (req, res) => {
  res.render('home')
})

app.route('/login')

  .get((req, res) => {
    res.render('login')
  })

  .post(async(req, res) => {
    let email = req.body.email
    let password = req.body.password

    if (!email || !password || password.length < 4) {
      res.sendStatus(400)
      return
    }

    let user = await User.findOne({
      email: email
    })

    if (!user || !await bcrypt.compare(password, user.password)) {
      res.sendStatus(403)
      return
    }

    res.render('secrets')
  })

app.route('/register')

  .get((req, res) => {
    res.render('register')
  })

  .post(async(req, res) => {
    let email = req.body.email
    let password = req.body.password

    if (!email || !password || password.length < 4) {
      res.sendStatus(400)
      return
    }

    let hash = await bcrypt.hash(password, saltRounds);

    await User.create({
      email: email,
      password: hash
    })

    res.redirect('/login')
  })

app.listen(appConfig.port, () => {
  console.log('Server started: port=' + appConfig.port)
})
