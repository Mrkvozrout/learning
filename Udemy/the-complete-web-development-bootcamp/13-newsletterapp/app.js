const express = require('express')
const bodyParser = require('body-parser')
const https = require('node:https')

const defaultPort = 3000
const port = process.env.PORT || defaultPort //hosting env or local port

const mailchimpApiKey = process.env.MAILCHIMP_API_KEY
const mailchimpAudienceId = process.env.MAILCHIMP_AUDIENCE_ID


var app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use("/public", express.static(__dirname + '/public'));


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html')
})

app.post('/', (req, res) => {
  var name = req.body.name
  var surname = req.body.surname
  var email = req.body.email
  if (!validateText(name) || !validateText(surname) || !validateText(email)) {
    console.log("Invalid input data.")
    res.sendFile(__dirname + '/failure.html')
    return
  }

  subscribeSingle(name, surname, email, res)
})

app.listen(port, () => {
  console.log('Server started: port=' + port)
})


function subscribeSingle(name, surname, email, res) {
  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: name,
          LNAME: surname
        }
      }
    ]
  }

  sendMailchimpRequest("https://us12.api.mailchimp.com/3.0/lists/" + mailchimpAudienceId, 'POST', data,
   (mcRes) => {
    if (mcRes.statusCode === 200) {
      res.sendFile(__dirname + '/success.html')
    }
    else {
      res.sendFile(__dirname + '/failure.html')
    }
  })
}

function sendMailchimpRequest(url, method, data, responseCallback) {
  var options = {
    auth: "test:" + mailchimpApiKey,
    method: method
  }
  
  var mcReq = https.request(url, options, responseCallback)

  if (data) {
    mcReq.write(JSON.stringify(data))
  }

  mcReq.end()
}

function validateText(text) {
  return text && text.length > 0;
}
