var express = require('express');
var moment = require('moment');
var md5 = require('md5');
var router = express.Router();

/* Define greetings for different times of the day in different languages. */
var settings = {
    greetings: {
      'english': ['Good morning', 'Hello', 'Good evening'],
      'french': ['Bonjour', 'Bonjour', 'Bonsoir'],
      'german': ['Guten morgen', 'Hallo', 'Guten abend'],
      'spanish': ['Buenos días', 'Hola', 'Buenas noches'],
      'portuguese': ['Bom dia', 'Olá', 'Boa noite'],
      'italian': ['Buongiorno', 'Ciao', 'Buonasera'],
      'swedish': ['God morgon', 'Hallå', 'God kväll']
    }
  }

/*
 Root page.
*/
router.get('/', function(req, res) {
  res.render('index');
});

/*
 == POST parameters:
 :config
   req.query.config contains a JSON array of responses to the options defined
   by the fields object in meta.json. In this case, something like:
   req.query.config = ["name":"SomeName", "lang":"SomeLanguage"]

 == Returns:
 A JSON response object.
 If the parameters passed in are valid: {"valid":true}
 If the parameters passed in are not valid: {"valid":false,"errors":["No name was provided"], ["The language you chose does not exist"]}
*/
router.post('/validate_config/', function(req, res){
  if(req.body.config == undefined)
  {
    res.status(400);
    res.render('error', { message: 'There is no config to validate.'});
  }

  // Preparing what will be returned
  var response = {
    errors: [],
    valid: true
  }

  /*
   Extract the config from the POST data and parse its JSON contents.
   user_settings will be something like: {"name":"Alice", "lang":"english"}.
  */
  var user_settings = req.body.config;

  // If the user did not choose a language:
  if(user_settings.lang == undefined){
    response.valid = false;
    response.errors.push('Please choose a language from the menu.');
  }

  // If the user did not fill in the name option:
  if(user_settings.name == undefined){
    response.valid = false;
    response.errors.push('Please enter your name into the name box.');
  }

  if(settings.greetings[user_settings.lang] == undefined){
    /*
     Given that the select field is populated from a list of languages
     we defined this should never happen. Just in case.
    */
    response.valid = false;
    response.errors.push("We couldn't find the language you selected ("+user_settings.lang+"). Please choose another.");
  }
  res.json(response);
})

/*
 Called to generate the sample shown on BERG Cloud Remote.

 == Parameters:
   None.

 == Returns:
 HTML/CSS edition.
*/
router.get('/sample/', function(req, res){
  // The values we'll use for the sample:
  var language = 'english';
  var name = 'Little Printer';

  /*
   Base the ETag on the unique content: language, name and time/date.
   This means the user will not get the same content twice.
   But, if they reset their subscription (with, say, a different language)
   they will get new content.
  */
  res.set('ETag', md5.digest_s(language + name + moment().format()));

  var greeting = settings.greetings[language][0]+", "+name;

  res.render('edition', {greeting: greeting})
})

/*
 Prepares and returns an edition of the publication.

 == Parameters:
 lang
   The language for the greeting.
   The subscriber will have picked this from the values defined in meta.json.
 name
   The name of the person to greet.
   The subscriber will have entered their name at the subscribe stage.
 local_delivery_time
   The local time where the subscribed bot is.

 == Returns:
 HTML/CSS edition with ETag.
*/
router.get('/edition/', function(req, res){
  // Local vars
  var language, name, date;

  // Accept the test flag and populate with sample data
  if(req.query.test == 'true'){
    language = 'english';
    name = 'Little Printer Validator';
    date = moment();
    date.day(1);
  }
  else{
    // Extract configuration provided by user through BERG Cloud.
    // These options are defined in meta.json.
    language = req.query.lang;
    name = req.query.name;

    if(req.query.local_delivery_time != undefined){
      // local_delivery_time is like '2013-11-18T23:20:30-08:00'.
      date = moment(req.query.local_delivery_time)
    }
  }

  if((language == undefined) || (settings.greetings[language] == undefined)){
    res.status(404);
    res.render('error', { message: 'Error: Invalid or missing lang parameter'});
  }
  if(name == undefined){
    res.status(404);
    res.render('error', { message: 'Error: No name provided'});
  }
  if(date == undefined){
    res.status(404);
    res.render('error', { message: 'Error: Invalid or missing local_delivery_time'});
  }

  // The publication is only delivered on Mondays, so if it's not a Monday in
  // the subscriber's timezone, we return nothing but a 204 status.
  if(date.day() != 1)
  {
    res.status(204);
  }

  // Pick a time of day appropriate greeting.
  var i = 1;
  if((date.hour() >= 4) && (date.hour() <= 11)){
    i = 0;
  }
  if((date.hour() >= 0) && (date.hour() <= 3)){
    i = 2;
  }
  if((date.hour() >= 18) && (date.hour() <= 24)){
    i = 2;
  }

  /*
   Base the ETag on the unique content: language, name and time/date.
   This means the user will not get the same content twice.
   But, if they reset their subscription (with, say, a different language)
   they will get new content.
  */
  res.set('ETag', md5.digest_s(language + name + date.format()));

  var greeting = settings.greetings[language][i]+", "+name;

  res.render('edition', {greeting: greeting})
})

module.exports = router;
