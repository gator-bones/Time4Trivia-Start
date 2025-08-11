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

async function addUserQuestion(questionData) {
  return withDB(async (db) => {
    const collection = db.collection('questions');
    return await collection.insertOne(questionData);
  });
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
    addUserQuestion,

  saveScore: async (username, score) =>
    withDB(async db => {
      const result = await db.collection('scores').insertOne({
        username,
        score,
        timestamp: new Date()
      });
      return result.insertedId;
    }),
     addUserQuestion,


    
};
