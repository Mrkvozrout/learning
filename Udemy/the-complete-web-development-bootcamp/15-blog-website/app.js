//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash')

const port = process.env.PORT || 3000


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


let blogPosts = []


app.get('/', (req, res) => {
  res.render('home', {
    _: _,
    content: homeStartingContent,
    blogPosts: blogPosts
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    content: aboutContent
  })
})

app.get('/contact', (req, res) => {
  res.render('contact', {
    content: contactContent
  })
})

app.route('/compose')
  .get((req, res) => {
    res.render('compose')
  })
  .post((req, res) => {
    let blogPost = new BlogPost(req.body.title, req.body.text)
    blogPosts.push(blogPost)
    res.redirect('/')
  })

app.get('/posts/:param', (req, res) => {
  let blogPost = findBlogPost(req.params.param)

  if (blogPost) {
    res.render('post', {
      blogPost: blogPost
    })
  }
  else {
    res.redirect('/')
  }
})

app.listen(port, function() {
  console.log("Server started: port=" + port);
});


function findBlogPost(text) {
  let key = _.kebabCase(text)

  for (const post of blogPosts) {
    if (post.key === key) {
      return post
    }
  }

  return false
}

function BlogPost(title, body) {
  this.key = _.kebabCase(title)
  this.title = title
  this.body = body
}