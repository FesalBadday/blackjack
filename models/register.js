const mongoose = require('mongoose') // import mongoose module

// players schema
const playersSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: true
  },
  userPassword: String,
  highestScore: {
    type: Number,
    default: 0
  },
  dateSigned: {
    type: String,
    default: new Date().toISOString().split('T')[0]
  }
})

module.exports = mongoose.model('players', playersSchema) // export mongoose