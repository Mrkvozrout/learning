const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const _ = require('lodash')

const date = require('./modules/date.js')
const appConfig = require('./modules/config.js')


// Set up DB model (mongoose)

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  }
})

const listSchema = new mongoose.Schema({
  key: {
    type: String,
    require: true
  },
  items: [itemSchema]
})

const Item = mongoose.model('Item', itemSchema)
const List = mongoose.model('List', listSchema)


// Set up Express

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));


//Connect to MongoDB

const mongoOptions = {}
if (appConfig.mongoUsername && appConfig.mongoPassword) {
  mongoOptions.auth = {
    username: appConfig.mongoUsername,
    password: appConfig.mongoPassword
  }
}
mongoose.connect(appConfig.mongoConnectionUri, mongoOptions)


// Set up request handlers

app.get('/', async(req, res) => {
  res.redirect('/default')
})

app.get('/:listName', async(req, res) => {
  let listKey = getListKey(req.params.listName)

  let items = await loadListItems(listKey)

  if (!items || items.length === 0) {
    items = getDefaultItems()
  }

  const day = date.getDate()
  res.render('list', {listTitle: day, listItems: items, listKey: listKey})
})

app.post('/:listName', async(req, res) => {
  let listKey = getListKey(req.params.listName)
  const itemName = req.body.newItem

  await insertItem(listKey, itemName)

  res.redirect('/' + listKey)
})

app.post('/:listName/delete', async(req, res) => {
  let listKey = getListKey(req.params.listName)
  let deleteItemId = req.body.deleteItem

  if (deleteItemId) {
    await deleteItem(listKey, deleteItemId)
  }

  res.redirect('/' + listKey)
})

app.get('/about', (req, res) => {
  res.render('about')
})


app.listen(appConfig.port, () => {
  console.log('Server started: port=' + appConfig.port)
})


// Local functions

function getDefaultItems() {
  return [
    new Item({name: 'Welcome to your TODO list'}),
    new Item({name: 'Hit + to add more items'}),
    new Item({name: '<- Check the checkbox to cross the item'})
  ]
}

async function insertItem(listKey, itemName) {
  let list = await List.findOne({key: listKey});

  if (!list) {
    list = new List({key: listKey})
  }

  if (!list.items) {
    list.items = []
  }

  list.items.push(new Item({name: itemName}))

  await list.save()
  .catch(error => {
    console.log('Failed to insert item: ' + error)
  })
}

async function deleteItem(listKey, deleteItemId) {
  await List.findOneAndUpdate({key: listKey}, {$pull: {items: {_id: deleteItemId}}})
  .catch(error => {
    console.log('Failed to remove item: ' + error);
  })
}

async function loadListItems(listKey) {
  let resultItems = []

  await List.findOne({key: listKey})
  .then(result => {
    if (result) {
      resultItems = result.items
    }
  })
  .catch(error => {
    console.log('Failed to load items: ' + error);
  })

  return resultItems
}

function getListKey(param) {
  return param ? _.kebabCase(param) : 'default'
}
