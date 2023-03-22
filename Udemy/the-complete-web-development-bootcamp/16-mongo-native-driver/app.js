const { MongoClient } = require('mongodb')

const mongoUri = 'mongodb://127.0.0.1:27017'

const mongoClient = new MongoClient(mongoUri)


async function run() {
  console.log('App started')

  try {
    const database = mongoClient.db('mflix');
    const movies = database.collection('movies');
    
    // await insertMovies(movies)
    await printMovieCount(movies)
    await searchMovies(movies, { title: 'Back to the Future' })
  }
  finally {
    await mongoClient.close();
  }
}

run().catch(console.dir);


async function insertMovies(moviesCollection) {
  console.log('inserting movies...')

  await moviesCollection.insertMany([
    {_id: 1, title: 'To the Moon', rating: 5},
    {_id: 2, title: 'Back to the Future', rating: 4.5}
  ])
}

async function printMovieCount(moviesCollection) {
  console.log('printing movies count: ' + await moviesCollection.countDocuments())
}

async function searchMovies(moviesCollection, query) {
  console.log(`searching for movies: query=${query}`)
  
  const movies = moviesCollection.find(query)
  await movies.forEach(console.dir);
}
