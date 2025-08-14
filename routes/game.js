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


// Show the form
router.get('/submit-question', (req, res) => {
  res.render('submit-question');
});

// Handle form submission
router.post('/submit-question', async (req, res) => {
  const { question, options, answer } = req.body;

  // console.log(req.body);

  try {
    const formattedOptions = Array.isArray(options) ? options : [options];

    if (!formattedOptions.includes(answer)) {
      return res.render('submit-question', {
        error: 'Answer must match one of the provided options.',
      });
    }

    const questionDoc = {
      question,
      options: formattedOptions,
      answer
      // submittedBy: req.session?.user?.username || 'anonymous',
      // submittedAt: new Date()
    };

    await db.addUserQuestion(questionDoc);
    res.render('submit-question', { success: true });
  } catch (err) {
    console.error(err);
    res.render('submit-question', { error: 'Failed to submit question.' });
  }
});



// router.post('/submit-score', async (req, res) => {
//   console.log('Submit score route hit!'); // Debug log
//   const sqlConfig = {
//     host: 'localhost',
//     user: 'root',
//     password: '306879',
//     database: 'Time4Trivia',
//     multipleStatements: true
//   };

//   const { score } = req.body;
//   const username = req.session?.user?.username;

//   console.log('Incoming score:', score);
//   console.log('Session username:', username);

//   if (!username) {
//     return res.status(401).json({ error: 'User not logged in' });
//   }

//   try {
//     const connection = await mysql2.createConnection(sqlConfig);
//     const query = `INSERT INTO scores (username, score) VALUES (?, ?)`; // ✅ Use correct table name
//     await connection.execute(query, [username, score]);
//     await connection.end();

//     res.json({ success: true, redirectUrl: '/score' });
//   } catch (err) {
//     console.error('Database error:', err.message);
//     res.status(500).json({ error: 'Failed to save score', details: err.message });
//   }
// });

router.post('/submit-question', async (req, res) => {
  try {
    const { question, options, answer } = req.body;
    console.log(req.body);


    if (!question || !options || !answer) {
      return res.status(400).render('submit-question', {
        error: 'All fields are required.',
        success: false
      });
    }

    const newQuestion = {
      question: question.trim(),
      options: Array.isArray(options) ? options.map(opt => opt.trim()) : [options.trim()],
      answer: answer.trim()
    };

    await req.db.add(newQuestion)
    await req.app.locals.db.collection('questions').insertOne(newQuestion);

    // Redirect to home page after successful insert
    res.redirect('/');

  } catch (err) {
    console.error('Error inserting question:', err);
    res.status(500).render('submit-question', {
      error: 'An error occurred while submitting the question.',
      success: false
    });
  }
});






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