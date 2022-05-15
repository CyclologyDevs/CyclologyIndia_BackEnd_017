// I M P O R T || D E P E N D E N C I E S

// Imports dependencies and sets up http server
require("dotenv").config();   //For use .env file
const express = require('express');   //For using EXPRESS JS
const cors = require('cors');   //For using Cross Origin Resource Sharing
const path = require('path');   //For getting the current directory path
const  bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const {fork} = require('child_process');   //For using Child Process
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./config/database');   //For DataBase Connection
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));  // Com/on JS


// creates express http server
const app = express();

// Importing the Routes
const eventsRouter = require('./routes/eventsRouter');
const accountRouter = require('./routes/accountRouter')
const connect_strava = require('./controllers/connect_strava')
const event_strava = require('./controllers/join_event')
const is_in_event = require('./controllers/is_in_event')
const contact_us = require('./middlewares/contactUs')


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// M I D D L E W A R E
app.use(cors()) 
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'));
app.use('/ProfilePics', express.static('ProfilePics'))
//app.use(express.urlencoded({extended:true}), cors({origin: 'http://localhost:3000'}));


app.use('/events', eventsRouter);
app.use('/account', accountRouter);


// R O U T E A || E N D P O I N T S

app.post('/connect_strava', connect_strava.connectStrava)

app.post('/join_event', event_strava.joinEvent);

app.post('/is_in_event', is_in_event.isInEvent);

app.post('/contact_us', contact_us.contactMe);


// Inserting Webhook Values into DB
const sql = 'INSERT INTO webhook (aspect_type, object_id, object_type, owner_id, authorized, UTC_timing, IST_timing) VALUES(?,?,?,?,?,?,?)';
let params;
async function webhook(reqJson)
{
  var time = new Date();
  var GMT_time = time.toUTCString();
  var IST_time = time.toString();
  params = [reqJson.aspect_type, reqJson.object_id, reqJson.object_type, reqJson.owner_id, reqJson.updates.authorized, GMT_time, IST_time];
    db.run(sql, params, err => {
        if (err)
          return console.error(err.message);
      
          console.log("Webhook Responds Inserted INTO webhook Table DB!!");
      })
}

// Creates the endpoint for our webhook
app.post('/webhook', (req, res) => {

  if(req.body.aspect_type == 'create')
  {
    webhook(req.body); // Inserting Webhook Values into DB

    //Working with Child Process for Multi-ThreadingDefining Child Process
    const childProcess = fork('webhookToStrava.js');
    childProcess.send(JSON.stringify(req.body));
    childProcess.on("Message", function (Message)  {console.log("ok " + Message);})
    //childProcess.on("Message", (Message) => {console.log("ok " + Message);})
  }
  else if(req.body.aspect_type == 'delete')
  {
    const sql = 'DELETE FROM strava, webhook WHERE webhook.object_id = ? OR strava.athlete_id = ?;';
    let params = [req.body.object_id, req.body.object_id];

    db.run(sql, params, err => {
      if (err)
        return console.error(err.message);
    
        console.log("Data Deleted from Strava and Webhook Table DB!!");
    })
  elif(req.body.aspect_type == 'update')
  {

    //Working with Child Process for Multi-ThreadingDefining Child Process
    const childProcess = fork('webhookToStravaUpdate.js');
    childProcess.send(JSON.stringify(req.body));
    childProcess.on("Message", function (Message)  {console.log("ok " + Message);})
    //childProcess.on("Message", (Message) => {console.log("ok " + Message);})

  }
  
  

  console.log("webhook event received!", req.query, req.body);
  res.status(200).send('EVENT_RECEIVED');
});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {
  // Your verify token. Should be a random string.
  const VERIFY_TOKEN = "STRAVA";
  // Parses the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Verifies that the mode and token sent are valid
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {     
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.json({"hub.challenge":challenge});  
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});











// L I S T E N I N G
app.listen( process.env.PORT || 3100, () => console.log(`Listening on Port ${process.env.PORT || 3100}`))