const express = require('express');
const router = express.Router();

// Example route: GET /q/question
router.get('/question', (req, res) => {
    console.log('🧠 /q/question route hit!');
  res.render('question', {
    title: 'Question Page',
    user: req.session.user,
    isAdmin: req.cookies?.isAdmin || false
  });
});

module.exports = router;
