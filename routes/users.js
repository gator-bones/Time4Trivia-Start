const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const STATUS_CODES = require('../models/statusCodes').STATUS_CODES;

router.get('/register', function (req, res, next) {
  res.render('register', { title: 'Time 4 Trivia', error: '' });
});

router.post('/register', async function (req, res, next) {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;

  let result = await userController.createUser(username, email, password, firstName, lastName);

  if (result?.status == STATUS_CODES.success) {
    res.redirect('/u/login');
  } else {
    res.render('register', { title: 'Time 4 Trivia', error: 'Register Failed' });
  }
});

router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Time 4 Trivia', error: '' });
});

// router.post('/login', async function (req, res, next) {
//   // Need to get the posted username and password
//   let username = req.body.username;
//   let password = req.body.password;

//   let result = await userController.login(username, password);

//   if (result?.status == STATUS_CODES.success) {
//     res.cookie('isAdmin', result.data.roles.includes("admin"));
//     req.session.user = { userId: result.data.userId, username: result.data.username };
//     res.redirect('/');
//   } else {
//     res.render('login', { title: 'Time 4 Trivia', error: 'Invalid Login. Please try again.' })
//   }
// });

router.post('/login', async function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  try {
    
    const result = await userController.login(username, password);

    if (result?.status === STATUS_CODES.success) {
      
      res.cookie('isAdmin', result.data.roles.includes("admin"));

      
      req.session.user = {
        userId: result.data.userId,
        username: result.data.username,
        isAdmin: result.data.roles.includes("admin")
      };

      
      res.redirect('/');
    } else {
      
      res.render('login', {
        title: 'Time 4 Trivia',
        error: 'Invalid Login. Please try again.'
      });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Server error during login');
  }
});


router.get('/logout', function (req, res, next) {
  // Clear session information?!?
  req.session.destroy((err) => { if (err) { console.log(err); } });
  res.clearCookie('isAdmin');

  res.redirect('/');
});

router.get('/profile', function (req, res, next) {
  res.render('profile', { title: 'Time 4 Trivia', user: req.session.user, isAdmin: req.cookies.isAdmin, error: '' });
});

router.post('/profile', async function (req, res, next) {
  let current = req.body.currentPassword;
  let new1 = req.body.newPassword;
  let new2 = req.body.confirmPassword;

  if (new1 != new2) {
    res.render('profile', { title: 'Time 4 Trivia', user: req.session.user, isAdmin: req.cookies.isAdmin, error: 'Password do not match' });
  } else {
    // console.log(`Changing passwor for userId ${req.session.user?.userId}`);
    let result = await userController.updateUserPassword(req.session.user.userId, current, new1, new2);
    if (result.status == STATUS_CODES.success) {
      res.redirect('/u/login');
    } else {
      res.render('profile', { title: 'Time 4 Trivia', user: req.session.user, isAdmin: req.cookies.isAdmin, error: 'Password update failed' });
    }
  }
});

module.exports = router;
