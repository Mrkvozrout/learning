const express = require('express')
const https = require('node:https')
const bodyParser = require('body-parser');
const { isNumberObject } = require('node:util/types');

const port = 3000;
const apiKey = process.env.OPENWEATHERMAP_API_KEY

var app = express();
app.use(bodyParser.urlencoded({extended: true}))


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.post('/weather', (req, res) => {
  var cityName = req.body.cityName
  if (!validateText(cityName)) {
    res.status(400).send("Invalid input")
    return
  }

  https.get(createWeatherUrl(cityName), (wRes) => {
    if (wRes.statusCode == 200) {
      wRes.on('data', (data => {
        var wData = JSON.parse(data)
        res.write('<h1>Weather in ' + cityName + '</h1>')
        res.write('<img src="http://openweathermap.org/img/wn/' + wData.weather[0].icon + '@2x.png" alt="" width="50px" height="50px">')
        res.write('<p>' + wData.weather[0].description + ', ' + wData.main.temp + '°C, feels like ' + wData.main.feels_like + '°C</p>')
        res.write('<a href="/">Back to next search</a>')
        res.send()
      }))
    }
    else {
      console.log('Failed to get weather data: status=' + wRes.statusCode + ', statusMessage=' + wRes.statusMessage)
      res.send('Failed to get weather data.')
    }
  })
})

app.listen(port, () => {
  console.log('Server started: port=' + port)
})


function validateText(text) {
  return text.length > 0;
}

function createWeatherUrl(cityName) {
  return 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=metric&appid=' + apiKey
}