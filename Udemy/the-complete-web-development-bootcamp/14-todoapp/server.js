const express = require('express')
const bodyParser = require('body-parser')
const tododate = requireLocal('todolist-date')

const port = process.env.PORT || 3000

const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static('public'))


let items = []


app.get('/', (req, res) => {
  res.render('list', {
    day: tododate.getDate(),
    items: items
  })
})

app.post('/', (req, res) => {
  items.push(req.body.newItem)
  res.redirect('/')
})

app.get('/about', (req, res) => {
  res.render('about')
})


app.listen(port, () => {
  console.log(`Server started: port=${port}`);
})


function getLocalPath(path) {
  return __dirname + '/' + path
}

function requireLocal(localModuleName) {
  return require(getLocalPath(localModuleName) + '.js')
}
