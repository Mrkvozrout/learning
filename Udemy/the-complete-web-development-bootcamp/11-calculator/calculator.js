const express = require("express")
const bodyParser = require("body-parser")

const port = 3000


var app = express()
app.use(bodyParser.urlencoded({extended: true}))


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

app.post("/", (req, res) => {
  var op1 = Number(req.body.op1)
  var op2 = Number(req.body.op2)
  res.send("Result is: " + (op1 + op2))
})


app.get("/bmi", (req, res) => {
  res.sendFile(__dirname + "/bmi.html")
})

app.post("/bmi", (req, res) => {
  var weight = parseFloat(req.body.weight)
  var height = parseFloat(req.body.height)
  res.send("BMI is: " + calculateBmiRounded(weight, height))
})


app.listen(port, () => {
  console.log("Server started on port " + port)
})


function calculateBmiRounded(weight, height) {
  return round(calculateBmi(weight, height), 2)
}

function calculateBmi(weight, height) {
  var heightM = height / 100
  return weight / (heightM * heightM)
}

function round(number, places) {
  var kat = Math.pow(10, places);
  return Math.round((number + Number.EPSILON) * kat) / kat
}