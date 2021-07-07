const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')

const app = express()
const apiKey = 'c23e4cdb9e2ffd8e8f46ea4575b5a8d4'


app.use(express.static('public'))
// Use body parser to parse POST data
app.use(bodyParser.urlencoded({extended : true}))

app.set('view-engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index.ejs', {
    error: null,
    data: null
  })
})

app.post('/', (req, res) => {
  console.log(req.body)
  const city = req.body.city
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`

  // Send GET request to OWM API
  request(apiUrl, function (err, response, body) {
    // If there is an error :

    if ( err ) {
      console.error(err)

      res.render('index.ejs', {
        data: null,
        error: 'Error, please try again'
      })

    } else {
      // If no connection errors :

      let weather = JSON.parse(body)

      // Request name of Country

      request(`https://restcountries.eu/rest/v2/alpha/${weather.sys.country}`, (co_err, co_res, co_body) => {

        if( co_err) {
          res.render('index.ejs', {
            data: null,
            error: 'Country was not found'
          })
        } else {
          // Get country and parse it
          let response = JSON.parse(co_body)
          countryName = response.name

          //Prepare data for client
          let data = {
            temp: weather.main.temp,
            country: countryName,
            iconID: weather.weather[0].icon,
            description: weather.weather[0].description,
            city: city
          }

          res.render('index.ejs', {
            data: data,
            error: null
          })
        }
      })
    }
  })
})

app.listen(3000, () => {
  console.log('App running: http://localhost:3000')
})
