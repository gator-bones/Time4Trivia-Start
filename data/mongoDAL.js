// const express = require('express');
// const { MongoClient } = require('mongodb');
// const { Await } = require('react-router-dom');
// require('dotenv').config();

// const app = express();
// const PORT = 8008;

// app.set('view engine', 'pug');
// app.set('views', './views');
// app.use(express.static('public'));

// const uri = 'mongodb+srv://<Johanna>:<306879>@cluster0.mongodb.net/testDB?retryWrites=true&w=majority';
// const client = new MongoClient(uri);

// app.get('/', async (req, res) => {
//   try {
//     await client.connect();
//     const db = client.db('Trivia');
//     const collection = db.collection('questions');
//     const questions = await collection.find().toArray();

//     res.render('index', { items });
//   } catch (err) {
//     res.status(500).send('Error connecting to database');
//   } finally {
//     await client.close();
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });


// data/mongoDAL.js
const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://Johanna:Jj306879@rest.4gkziko.mongodb.net/';
const dbName = 'Trivia';

async function withDB(callback) {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    return await callback(db);
  } finally {
    await client.close();
  }
}

module.exports = {
  getAllQuestions: async () =>
    withDB(db => db.collection('questions').find().toArray()),

  getTopScores: async () =>
    withDB(db =>
      db.collection('scores')
        .find()
        .sort({ score: -1 })
        .limit(10)
        .toArray()
    ),

  saveScore: async (username, score) =>
    withDB(async db => {
      const result = await db.collection('scores').insertOne({
        username,
        score,
        timestamp: new Date()
      });
      return result.insertedId;
    }),
};
