const express = require('express');
const router = express.Router();
const db = require('../data/mongoDAL.js');
const mysql = require('../data/sqlDAL.js')
const mysql2 = require('mysql2/promise')

// Play route - renders the trivia game page
router.get('/play', async function (req, res) {
  try {
    const allQuestions = await db.getAllQuestions();
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    const questions = shuffled.slice(0, 5);

    res.render('play', {
      user: req.session?.user || null,
      isAdmin: req.cookies?.isAdmin || false,
      questions,
      questionsJSON: JSON.stringify(questions), // Stringified for client-side use
      username: req.session?.user?.username || ''
    });
  } catch (err) {
    console.error('Error fetching trivia questions:', err);
    res.status(500).send('Error loading trivia game');
  }
});

router.post('/submit-score', async (req, res) => {
  const sqlConfig = {
    host: 'localhost',
    user: 'root',
    password: '306879',
    database: 'Time4Trivia',
    multipleStatements: true
  };

  const { score } = req.body;
  const username = req.session?.user?.username;

  console.log('Incoming score:', score);
  console.log('Session username:', username);

  if (!username) {
    return res.status(401).json({ error: 'User not logged in' });
  }

  try {
    const connection = await mysql2.createConnection(sqlConfig);
    const query = `INSERT INTO scores (username, score) VALUES (?, ?)`; // ✅ Use correct table name
    await connection.execute(query, [username, score]);
    await connection.end();

    res.json({ success: true, redirectUrl: '/score' });
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({ error: 'Failed to save score', details: err.message });
  }
});



// router.post('/submit-score', express.json(), async function (req, res) {
//   const { username, score } = req.body;

//   if (!username || typeof score !== 'number') {
//     return res.status(400).json({ message: 'Invalid data' });
//   }

//   try {
//     const insertedId = await db.saveScore(username, score);
//     res.status(200).json({ 
//       message: 'Score saved', 
//       id: insertedId,
//       redirectUrl: `/score?score=${score}`
//     });
//   } catch (err) {
//     console.error('Error saving score:', err);
//     res.status(500).json({ message: 'Failed to save score' });
//   }
// });



// Score display route
router.get('/score', function (req, res) {
  const score = parseInt(req.query.score) || 0;
  const user = req.session?.user || { username: '' };

  res.render('score', {
    score,
    user
  });
});

module.exports = router;