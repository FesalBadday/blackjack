const mongoose = require('mongoose') // import mongoose module

// leaderboard schema
const leaderboardSchema = new mongoose.Schema({
  userName: String,
  highestScore: Number
})

module.exports = mongoose.model('leaderboard', leaderboardSchema) // export mongoose