const appConfig = require('./modules/config.js')
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const findOrCreate = require('mongoose-findorcreate')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy


// Setup DB

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true
  },
  googleProfileId: String,
  facebookProfileId: String,
  secret: String
})
userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
  usernameUnique: true
})
userSchema.plugin(findOrCreate)

const User = mongoose.model('User', userSchema)


mongoose.connect(appConfig.mongoConnectionUri)


// Setup passport (auth)

passport.use(User.createStrategy())

passport.serializeUser(function(user, cb) {
  return cb(null, {
    id: user.id,
    username: user.username,
    picture: user.picture
  });
});

passport.deserializeUser(function(user, cb) {
  return cb(null, user);
});

passport.use(new GoogleStrategy(
  {
    clientID: appConfig.googleClientId,
    clientSecret: appConfig.googleClientSecret,
    callbackURL: 'http://localhost:3000/auth/google/secrets'
  },
  (accessToken, refreshToken, profile, cb) => {
    User.findOrCreate({
      googleProfileId: profile.id,
      email: profile._json.email
    },
    (err, user) => {
      return cb(err, user);
    });
  }
));

passport.use(new FacebookStrategy(
  {
    clientID: appConfig.facebookClientId,
    clientSecret: appConfig.facebookClientSecret,
    callbackURL: "http://localhost:3000/auth/facebook/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({
      facebookProfileId: profile.id,
    },
    (err, user) => {
      return cb(err, user);
    });
  }
));


// Setup app

const app = express()
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.set('trust proxy', 1) // trust first proxy

const sessionOptions = {
  secret: appConfig.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true
  }
}

if (appConfig.env === 'development') {
  sessionOptions.cookie.secure = false
}

app.use(session(sessionOptions))
app.use(passport.session())


// Request handlers

app.get('/', (req, res) => {
  res.render('home', {user: req.user})
})

app.route('/login')

  .get((req, res) => {
    res.render('login')
  })

  .post((req, res) => {
    let email = req.body.email
    let password = req.body.password

    if (!email || !password || password.length < 4) {
      res.sendStatus(400)
      return
    }

    let user = new User({
      email: email,
      password: password
    })

    req.login(user, function(err) {
      if (err) {
        console.log('Failed to login: ' + err)
        res.redirect('/login')
        return
      }
      
      passport.authenticate('local')(req, res, () => {
        res.redirect('/secrets')
      })
    });
  })

app.route('/logout')

  .get((req, res) => {
    req.logout((err) => {
      if (err) {
        console.log('Failed to logout: ' + err)
        return
      }

      res.redirect('/')
    })
  })

app.route('/register')

  .get((req, res) => {
    if (req.user) {
      res.redirect('/secrets')
    }
    else {
      res.render('register')
    }
  })

  .post((req, res) => {
    if (req.user) {
      res.redirect('/')
      return
    }

    let email = req.body.email
    let password = req.body.password

    if (!email || !password || password.length < 4) {
      res.sendStatus(400)
      return
    }

    User.register({email: email}, password, (err, user) => {
      if (err) {
        console.log(err)
        res.redirect('/register')
        return
      }

      passport.authenticate('local')(req, res, () => {
        res.redirect('/secrets')
      })
    })
  })

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/secrets');
  }
);

app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['public_profile', 'email']})
);

app.get('/auth/facebook/secrets',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/secrets');
  }
);

app.route('/secrets')

  .get(async(req, res) => {
    let secrets = await User.find({secret: {$ne: null}}, {secret: 1})

    res.render('secrets', {
      secrets: secrets,
      user: req.user
    })
  })

app.route('/submit')

  .get((req, res) => {
    if (req.isAuthenticated()) {
      res.render('submit')
    }
    else {
      res.redirect('/login')
    }
  })

  .post(async(req, res) => {
    if (!req.isAuthenticated()) {
      res.redirect('/login')
      return
    }

    if (!req.user && !req.user.id && !req.body.secret) {
      res.sendStatus(400);
      return
    }

    let user = await User.findById(req.user.id)
    user.secret = req.body.secret
    await user.save()

    res.redirect('/secrets')
  })

app.listen(appConfig.port, () => {
  console.log('Server started: port=' + appConfig.port)
})
