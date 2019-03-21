//////////////////////////////
// NPM THIRD PARTY MODULES //
//////////////////////////////
require('dotenv').config() // stores env variables
const express = require('express');
const hbs = require('hbs'); // handlebars
const bodyParser = require('body-parser'); // required to read express's request object https://www.npmjs.com/package/body-parser
const axios = require('axios'); // promise based http requests https://www.npmjs.com/package/axios


///////////////////
// GENERAL SETUP //
///////////////////

var app = express();
const port = '8081';

//handlebars setup
hbs.registerPartials(__dirname + '/views/partials');
//copyright year function
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});


/////////////////
// MIDDLEWARE //
////////////////

app.set('view engine', 'hbs');
//pings console each time user agent contacts server
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${ now } via : ${ req.method } at ${ req.url } from ${ req.RemoteAddr }`;
    console.log(log);
    next();
  });
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));


//////////////
// ROUTING //
/////////////

app.get('/', (req, res) => {
    res.render('pages/index.hbs');
  });

app.post('/', (req, res) => {
  var encodedAddress = encodeURIComponent(req.body.lookupAddress)
  var googleAPI = process.env.GOOGLEAPIKEY;
  var darkskyAPI = process.env.DARKSKYAPI;
  var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${ encodedAddress }&key=${ googleAPI }`
  async function geoData() {
    const geo = await axios.get(geocodeUrl)
    var formattedAddress = geo.data.results[0].formatted_address
    var lat = geo.data.results[0].geometry.location.lat;
    var lng = geo.data.results[0].geometry.location.lng;
    var weatherUrl = `https://api.darksky.net/forecast/${ darkskyAPI }/${ lat },${ lng }`;
    const data = await axios.get(weatherUrl);
    var temp = Math.round(data.data.currently.temperature);
    var apparentTemp = Math.round(data.data.currently.apparentTemperature);
    var summary = data.data.currently.summary;
    var hourlySummary = data.data.hourly.summary;
    var dailySummary = data.data.daily.summary;
    res.render('pages/results.hbs', {
      summary,
      hourlySummary,
      dailySummary,
      formattedAddress,
      apparentTemp,
      temp
    })
  }
  geoData().catch(() => {
    console.log('Error')
    res.render('pages/error.hbs', {
      errorMessage: "Error fetching request.  Please try again."
    })
  })
})


app.listen(port);
console.log(`Server started on port ${ port }`)
