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

router.get('/question', (req, res) => {
    console.log('🧠 /q/question route hit!');
  res.render('question', {
    title: 'Question Page',
    user: req.session.user,
    isAdmin: req.cookies?.isAdmin || false
  });
});

router.get('/submit-question', (req, res) => {
  res.render('submit-question');
});

// POST: process form
router.post('/submit-question', async (req, res) => {
  const { question, options, answer } = req.body;

  try {
    // Ensure options is an array
    const formattedOptions = Array.isArray(options) ? options : [options];

    if (!formattedOptions.includes(answer)) {
      return res.render('submit-question', {
        error: 'Answer must match one of the provided options.',
      });
    }

    const questionDoc = {
      question,
      options: formattedOptions,
      answer,
      submittedBy: req.session?.user?.username || 'anonymous',
      submittedAt: new Date()
    };

    await db.addUserQuestion(questionDoc);
    res.render('submit-question', { success: true });
  } catch (err) {
    console.error(err);
    res.render('submit-question', { error: 'Failed to submit question.' });
  }
});

module.exports = router;
