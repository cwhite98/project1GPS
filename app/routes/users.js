const router = require('express').Router();
const passport = require('passport');

// Models
const User = require('../models/User');

router.get('/signup', (req, res) => {
  res.render('users/signup');
});

router.post('/signup', async (req, res) => {
  let errors = [];
  const { firstName, lastName, username, email, password, confirm_password } = req.body;
  if(password != confirm_password) {
    errors.push({text: 'Passwords do not match.'});
  }
  if(password.length < 4) {
    errors.push({text: 'Passwords must be at least 4 characters.'})
  }
  if(errors.length > 0){
    res.render('users/signup', {errors, firstName, lastName, username, email, password, confirm_password});
  } else {
    // Look for email coincidence
    const emailUser = await User.findOne({email: email});
    if(emailUser) {
      req.flash('error_msg', 'The Email is already in use.');
      res.redirect('/signup');
    } else {
      // Saving a New User
      const newUser = new User({firstName, lastName, username, email, password});
      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();
      req.flash('success_msg', 'You are registered.');
      res.redirect('/login');
    }
  }
});

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/allRoutes',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out now.');
  res.redirect('/login');
});

module.exports = router;
