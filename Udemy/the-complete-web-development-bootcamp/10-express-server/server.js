const express = require("express")

const port = 3000;

var app = express()

app.get("/", (req, res) => {
  res.send("<h1>Ahoj</h1>")
})

app.get("/contact", (req, res) => {
  res.send("Still no contact")
})

app.listen(port, () => {
  console.log("Server started at port " + port)
})
