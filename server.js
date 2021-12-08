/******************/
/* Import Modules */
/******************/
require('dotenv').config() // import dotenv module

const express = require('express') // import express module
const app = express()

const api = require('./routes/api.js') // import api module
app.use('/', api)

const mongoose = require('./models/connection') // import connection module
//const axios = require('axios').default;

const path = require('path') // import path module

// view engine setup
app.set('views', path.join(__dirname, 'public'))
// setting view engine
app.set('view engine','ejs')

// Serve static files using middleware
app.use(express.static('public'))

/****************************/
/* Handle 404, start server */
/****************************/

// Handle 404 errors with middleware
app.use((req, res) => {
  // redirect to 404 error page
  res.status(404).redirect('/404') // redirect to 404 page
})

// Start server
const PORT = process.env.PORT || 3000 // Localhost:3000

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})