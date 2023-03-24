const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/personDB');


// Fruit - save

const fruitSchema = new mongoose.Schema({
  name: String,
  rating: Number
})

const Fruit = mongoose.model('Fruit', fruitSchema)

// insertFruit()
findFruits()


function insertFruit() {
  const apple = new Fruit({
    name: 'Apple',
    rating: 7
  })

  apple.save()
}

function findFruits() {
  Fruit.find({})
  .then((result) => {
    console.log(result)
  })
  .catch((err) => {
    console.log('Something went wrong: ' + err)
  })
}


// Person, insertMany

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    min: 0
  },
  confirmed: {
    type: Boolean,
    default: false
  }
})

const Person = mongoose.model('Person', personSchema)

// insertPersons()
findPersons()

function insertPersons() {
  Person.insertMany([
    {name: 'John', age: 27, confirmed: true},
    {name: 'Emma', age: 25, confirmed: false},
    {name: 'Hubert', age: 35, confirmed: true}
  ])
}

function findPersons() {
  Person.find({}, {name: 1, age: 1})
  .then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} (${person.age})`)
    })
  })
  .catch((err) => {
    console.log('Something went wrong: ' + err)
  })
}



setTimeout(() => {
  mongoose.connection.close()
}, 100);
