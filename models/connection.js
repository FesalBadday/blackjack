/***********************/
/* Connect to Database */
/***********************/
const mongoose = require('mongoose') // import mongoose module

// make the connection
mongoose.connect(
  process.env.MONGODB_URL,
  { useUnifiedTopology: true, useNewUrlParser: true },
)
  .then(() => { // check if connection is made
    console.log('Connected to DB...')
  })
  .catch((e) => { // catch errors
    console.log(e)
  });

module.exports = mongoose // export mongoose