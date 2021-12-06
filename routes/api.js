/******************/
/* Import Modules */
/******************/
const express = require('express') // import express module
const router = express.Router()
router.use(express.json())
router.use(express.urlencoded({ extended: true }))

const LeaderBoard = require('../models/leaderboard') // import store module
const Player = require('../models/register') // import subscriber module

/* const bodyParser = require('body-parser')
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true })) */


/******************/
/*  Render Pages  */
/******************/

router.post('/', async (req, res) => {
  try {
    const newScore = await req.body.highestScore
    playerName = await LeaderBoard.findOne({ userName: 'Test' }) // find all data

    if (playerName === null) {
      const newPlayer = new LeaderBoard(req.body)
      await newPlayer.save() // save user
      console.log(newPlayer)
    } else {
      if (newScore > playerName.highestScore) {
        await LeaderBoard.findOneAndUpdate({ userName: playerName.userName }, { $set: { highestScore: newScore } }, { new: true })
        console.log(`Player Is ${playerName.userName}`)
        console.log(`New Score ${newScore}`)
        console.log(`Old Score ${playerName.highestScore}`)
      }
    }

  } catch (e) { // catch errors
    console.log(e) // console log the error
    res.send({ error: 'Players Not Found' }) // send JSON 404 error
  }
})

router.get('/public', async (req, res) => {
  res.render('index')
})

router.get('/public/login', (req, res) => {
  res.render('login')
})

router.get('/public/register', (req, res) => {
  res.render('register')
})

router.get('/public/leaderboard', (req, res) => {
  res.render('leaderboard')
})

/* router.get('/404', (req, res) => {
  res.render('404')
}) */

// get store data
router.get('/players', async (req, res) => {
  try {
    res.json(await LeaderBoard.find({ userName: 'test' })) // find all data
  } catch (err) { // catch errors
    console.log(err) // console log the error
    res.send({ error: 'Players Not Found' }) // send JSON 404 error
  }
})

// add new subscriber
router.post('/join', async (req, res) => {
  try {
    const newPlayer = new Player(req.body)

    await newPlayer.save() // save user
    res.send('<h1>Congratulations, You’ve Joined Successfully!</h1><a href="login">Click Here To Go Back</a>')
    console.log(newPlayer)

  } catch (err) { // catch errors
    // check if user is subscribed
    if (err.code === 11000) {
      res.send('<h1>You’re Already Registered!</h1><a href="login">Click Here To Login</a>')
    } else {
      res.send('<h1>Something Went Wrong!</h1><a href="register">Click Here To Go Back</a>')
    }
    console.log(err) // console log the error
  }
})

module.exports = router // export router