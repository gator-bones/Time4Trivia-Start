const express = require('express');
const router = express.Router();
const db = require('../data/mongoDAL.js');

router.get('/play', async function (req, res) {
  try {
    const questions = await db.getAllQuestions();
    res.render('play', {
      user: req.session?.user || null,
      isAdmin: req.cookies?.isAdmin || false,
      questions
    });
  } catch (err) {
    console.error('Error fetching trivia questions:', err);
    res.status(500).send('Error loading trivia game');
  }
});

router.get('/leaderboard', async function (req, res) {
  try {
    const scores = await db.getTopScores();
    res.render('leaderboard', { scores });
  } catch (err) {
    console.error('Error loading leaderboard:', err);
    res.status(500).send('Error loading leaderboard');
  }
});

router.post('/submit-score', express.json(), async function (req, res) {
  const { username, score } = req.body;

  if (!username || typeof score !== 'number') {
    return res.status(400).json({ message: 'Invalid data' });
  }

  try {
    const insertedId = await db.saveScore(username, score);
    res.status(200).json({ message: 'Score saved', id: insertedId });
  } catch (err) {
    console.error('Error saving score:', err);
    res.status(500).json({ message: 'Failed to save score' });
  }
});

router.get('/score', function (req, res) {
  req.session.user = { username: ''}
  const score = parseInt(req.query.score) || 0;
  const user = req.session?.user;

  res.render('score', {
    score,
    user
  });
});


module.exports = router;
