// const express = require('express');
// const router = express.Router();

// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Time 4 Trivia', user: req.session.user, isAdmin: req.cookies.isAdmin });
// });



// router.get('/leaderboard', async function (req, res) {
//   try {
//     const scores = await db.getTopScores();
//     res.render('leaderboard', { scores });
//   } catch (err) {
//     console.error('Error loading leaderboard:', err);
//     res.status(500).send('Error loading leaderboard');
//   }
// });

// router.get('/leaderboard', function(req, res, next) {
//   // TODO: Get actual leader data from the MONGO database!
//   let leaders = [
//     {
//       name: 'Sue', score: 100
//     },
//     {
//       name: 'Don', score: 99
//     },
//     {
//       name: 'Ralph', score: 3
//     }
//   ];
//   res.render('leaderboard', { title: 'Time 4 Trivia', user: req.session.user, isAdmin: req.cookies.isAdmin, leaders: leaders });
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// MySQL config
const sqlConfig = {
  host: 'localhost',
  user: 'root',
  password: '306879',
  database: 'Time4Trivia',
  multipleStatements: true
};

// Home route
router.get('/', function(req, res) {
  res.render('index', {
    title: 'Time 4 Trivia',
    user: req.session.user,
    isAdmin: req.cookies.isAdmin
  });
});

// Leaderboard route
router.get('/leaderboard', async function (req, res) {
  try {
    const conn = await mysql.createConnection(sqlConfig);
    const [rows] = await conn.execute(
      'SELECT username, score, created_at FROM scores ORDER BY score DESC LIMIT 10'
    );
    await conn.end();

    res.render('leaderboard', {
      title: 'Time 4 Trivia',
      user: req.session.user,
      isAdmin: req.cookies.isAdmin,
      leaders: rows
    });
  } catch (err) {
    console.error('Error loading leaderboard:', err);
    res.status(500).send('Error loading leaderboard');
  }
});

module.exports = router;
