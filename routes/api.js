/******************/
/* Import Modules */
/******************/
const express = require('express')
const router = express.Router()
router.use(express.json())
router.use(express.urlencoded({ extended: true }))

const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

router.use(flash())
router.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 }
}))

require('../passport-config')(passport); // passport config

router.use(passport.initialize())
router.use(passport.session())

const Player = require('../models/register') // import schema module

router.get('/', playerAuthenticated, (req, res) => {
  res.render('index', { name: req.user.userName })
})

router.post('/', async (req, res) => {
  try {
    if (req.user) {
      const newScore = await req.body.highestScore
      const newGame = await req.body.newGame
      const playerName = await Player.findOne({ userName: req.user.userName }) // find all data
      const timesPlayed = playerName.gamesPlayed + 1
      
      if (newScore > playerName.highestScore) {
        await Player.findOneAndUpdate({ userName: playerName.userName }, { $set: { highestScore: newScore } }, { new: true })
      } else if (newGame) {
        await Player.findOneAndUpdate({ userName: playerName.userName }, { $set: { gamesPlayed: timesPlayed } }, { new: true })
      }
    }

  } catch (e) { // catch errors
    console.log(e) // console log the error
    res.send({ error: 'Players Not Found' }) // send JSON 404 error
  }
})

router.get('/leaderboard', playerAuthenticated, (req, res) => res.render('leaderboard'))

router.get('/rules', (req, res) => res.render('rules'))

router.get('/404', (req, res) => res.render('404'))

// get store data
router.get('/players', async (req, res) => {
  try {
    res.json(await Player.find().limit(20).sort({ highestScore: -1 })) // find all data
  } catch (e) { // catch errors
    console.log(e) // console log the error
    res.send({ error: 'No Players Were Found' }) // send JSON 404 error
  }
})

router.get('/login', playerNotAuthenticated, (req, res) => res.render('login'))

router.post('/login', playerNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))


router.get('/register', playerNotAuthenticated, (req, res) => res.render('register'))
// add new subscriber
router.post('/register', playerNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const newPlayer = new Player({
      userName: req.body.name,
      userPassword: hashedPassword
    })

    await newPlayer.save() // save user
    res.redirect('/login')

  } catch (e) { // catch errors
    let errorMessage = '';
    // check if user is subscribed
    if (e.code === 11000) {
      errorMessage = 'Name already exists'
    } else {
      errorMessage = 'Something Went Wrong!'
    }
    res.render('register', { errorMessage })
    console.log(e) // console log the error
  }
})

router.get('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function playerAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.render('index', { name: '' })
}

function playerNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

module.exports = router // export router