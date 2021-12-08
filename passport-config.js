const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// Load User model
const Player = require('./models/register') // import subscriber module

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'name' }, (name, password, done) => {

      // Match user
      Player.findOne({
        userName: name
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'Player is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.userPassword, (e, isMatch) => {
          try {
            if (e) throw e;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Password incorrect' });
            }
          } catch (e) {
            return done(e)
          }
        });
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    Player.findById(id, function (err, user) {
      done(err, user);
    });
  });
};