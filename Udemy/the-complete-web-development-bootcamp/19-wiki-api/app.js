const express = require('express')
const bodyParser = require('body-parser')
const appConfig = require('./modules/config.js')
const mongoose = require('mongoose')


// App setup

const app = express()
app.use(bodyParser.urlencoded({extended: true}))


//Mongoose setup

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
})

const Article = mongoose.model('Article', articleSchema)


const mongoOptions = {}
if (appConfig.mongoUsername && appConfig.mongoPassword) {
  mongoOptions.auth = {
    username: appConfig.mongoUsername,
    password: appConfig.mongoPassword
  }
}
mongoose.connect(appConfig.mongoConnectionUri)


// Request handlers

app.route('/articles')

  .get(async(req, res) => {
    let articles = await Article.find();
    res.json({
      articles: articles
    })
  })

  .post(async (req, res) => {
    let title = req.body.title
    let content = req.body.content

    if (!title || !content) {
      res.sendStatus(400)
      return
    }

    await Article.create({
      title: title,
      content: content
    })

    res.sendStatus(201)
  })

  .delete(async(req, res) => {
    await Article.deleteMany();
    res.sendStatus(200)
  })

  app.route('/articles/:id')
  
    .get(async(req, res) => {
      let id = req.params.id

      if (!id) {
        res.sendStatus(400)
        return
      }

      let article = await Article.findById(id)

      res.json(article)
    })

    .put(async(req, res) => {
      let id = req.params.id
      let title = req.body.title
      let content = req.body.content

      if (!id || !title || !content) {
        res.sendStatus(400)
        return
      }

      await Article.findOneAndReplace(
        {_id: id},
        {title: title, content: content})

      res.sendStatus(200)
    })

    .patch(async(req, res) => {
      let id = req.params.id
      let title = req.body.title
      let content = req.body.content

      if (!id || (!title && !content)) {
        res.sendStatus(400)
        return
      }

      let updateObject = {}
      if (title) {
        updateObject.title = title
      }
      if (content) {
        updateObject.content = content
      }

      await Article.findByIdAndUpdate(id, updateObject)

      res.sendStatus(200)
    })
  
    .delete(async(req, res) => {
      let id = req.params.id

      if (!id) {
        res.sendStatus(400)
        return
      }

      await Article.findByIdAndDelete(id)

      res.sendStatus(200)
    })

app.listen(appConfig.port, () => {
  console.log('Server started: port=' + appConfig.port)
})
