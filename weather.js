//////////////////////////////
// NPM Third Party Modules //
////////////////////////////

const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser'); // required to read express's request object https://www.npmjs.com/package/body-parser
const axios = require('axios'); // promise based http requests https://www.npmjs.com/package/axios


// GENERAL SETUP
var app = express();
const port = '8081';

//handlebars setup
hbs.registerPartials(__dirname + '/views/partials');
//copyright year function
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});


// MIDDLEWARE
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


// ROUTING
app.get('/', (req, res) => {
    res.render('pages/index.hbs');
  });


app.listen(port);
console.log(`Server started on port ${ port }`)
