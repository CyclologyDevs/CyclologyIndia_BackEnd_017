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
var eventsRouter = require('./routes/eventsRouter');
var accountRouter = require('./routes/accountRouter')


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// M I D D L E W A R E
app.use(cors()) 
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'));
//app.use(express.urlencoded({extended:true}), cors({origin: 'http://localhost:3000'}));


app.use('/events', eventsRouter);
app.use('/account', accountRouter);


// R O U T E A || E N D P O I N T S

app.get('/profile/:uuid', (req, res) => {
   let id = req.params.uuid;

  const sql = `SELECT uuid,fname,lname,athlete_id,email,phone_number,gender,date_of_birth,blood_group,emergency_contact,relation_emergency_contact,insta_link,facebook_link,twitter_link,linkdin_link,occupation,about_you,accident_insurance_number FROM users WHERE uuid = ?`;
  let params = [id];

  db.all(sql,params, (err, data, fields) => {
    if (err)
      return console.error(err.message);
    
      if(data.length <= 0) {
        res.status(200).send(`Hi! ${id} <br> JSON DATA = <br> <h1>NO USER FOUND @ UUID = ${id}</h1>`);
      }
      else {
        res.status(200).send(data[0]);

        //res.send(`Hi! ${id} <br> JSON DATA = <br> ${data[0].fname + ' ' + data[0].lname}`);
      }
  })
})

app.post('/login', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  console.log(email, password);

  const sql = `SELECT uuid,fname,lname,athlete_id,email,password,phone_number,gender,date_of_birth,blood_group,emergency_contact,relation_emergency_contact,insta_link,facebook_link,twitter_link,linkdin_link,occupation,about_you,accident_insurance_number FROM users WHERE email = ? AND password = ?`;
  let params = [email, password];

  db.all(sql,params, (err, data, fields) => {
    if (err)
      return console.error(err.message);
    
    if (data.length > 0) {
      res.status(200).send(data[0]);  
    } else {
      res.sendStatus(403);      
    }  
  })
});

app.post('/signup', (req, res) => {
  let uuid = Date.now();
  let fname = req.body.fname;
  let lname = req.body.lname;
  let email = req.body.email;
  let password = req.body.password;
  let phone_number = req.body.phone_number;
  let gender = req.body.gender;
  let date_of_birth = req.body.date_of_birth;
  let blood_group = req.body.blood_group;
  let emergency_contact = req.body.emergency_contact;
	let relation_emergency_contact = req.body.relation_emergency_contact;
	let insta_link = req.body.insta_link;
	let facebook_link = req.body.facebook_link;
	let twitter_link = req.body.twitter_link;
	let linkdin_link = req.body.linkdin_link;
	let occupation = req.body.occupation;
	let about_you = req.body.about_you;
	let accident_insurance_number = req.body.accident_insurance_number;

  const sql = `INSERT INTO users(uuid,fname,lname,email,password,phone_number,gender,age,date_of_birth,blood_group,emergency_contact,relation_emergency_contact,insta_link,facebook_link,twitter_link,linkdin_link,occupation,about_you,accident_insurance_number) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;
  let params = [uuid,fname,lname,email,password,phone_number,gender,age,date_of_birth,blood_group,emergency_contact,relation_emergency_contact,insta_link,facebook_link,twitter_link,linkdin_link,occupation,about_you,accident_insurance_number];

  db.all(sql,params, (err, data, fields) => {
    if (err)
      return console.error(err.message);
     
      res.status(200)
      console.error("A/C created =>  "+ email + " " + password);
    }
  )
});

app.post('/connect_strava', (req, res) => {
    
  var { code, uuid, email } = req.body;
  console.log(code);
  console.log(uuid);
  console.log(email);

    async function strava() {
      const headers = {
        'Accept' : 'application/json, text/plain, */*',
        'Content-Type' : 'application/json'
        }

      const body = JSON.stringify({
        client_id : '76784',
        client_secret : '76c6081709c9a95b48a176d2b3260ddd2d8f79e6',
        code : code,
        grant_type : 'authorization_code',
        })

      const oAuthExchange = await fetch('https://www.strava.com/oauth/token', {
            method : 'POST',
            "headers" : headers,
            "body" : body,
        })

    const oAuthRes = await oAuthExchange.json();

    // console.log("Access Token =>  " + oAuthRes.access_token);
    // console.log("Refresh Token =>  " + oAuthRes.refresh_token);
    // console.log("Strava Athlete ID =>  " + oAuthRes.athlete.id);
    // console.log("Expiration AT =>  " + oAuthRes.expires_at);
    // console.log("Expiration IN =>  " + oAuthRes.expires_in);

    // console.log("Response JSON =>  \n");
    // console.log(oAuthRes);
    

    //const sql = `INSERT INTO users(athlete_id,refresh_token,access_token,access_token_expiration) VALUES(?,?,?,?,?) WHERE email = ?;`;
    const sql = `UPDATE users SET athlete_id=?, refresh_token=?, access_token=?, access_token_expiration=? WHERE email = ?;`;
    let params = [oAuthRes.athlete.id,oAuthRes.refresh_token,oAuthRes.access_token,oAuthRes.expires_at,email];
  
    db.all(sql,params, (err, data, fields) => {
      if (err)
        return console.error(err.message);
       
        res.status(200)
        console.error("Strava connected =>  "+ oAuthRes.athlete.id + " " + oAuthRes.refresh_token);
      }
    )
    } 
    strava()

    
})

app.post('/join_event', (req, res) => {
  let { uuid, athlete_id, event_start_date, event_end_date, event_name } = req.body;

  const sql = `INSERT INTO event(uuid, athlete_id, event_start_date, event_end_date, event_name) VALUES(?,?,?,?,?);`;
  let params = [uuid, athlete_id, event_start_date, event_end_date,event_name];

  db.all(sql,params, (err, data, fields) => {
    if (err)
      return console.error(err.message);
     
      res.status(200)
      console.error("Event Joint by Athlete =>  "+ uuid + " " + athlete_id);
    }
  )
});



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
  webhook(req.body); // Inserting Webhook Values into DB

  //Working with Child Process for Multi-ThreadingDefining Child Process
  const childProcess = fork('webhookToStrava.js');
  childProcess.send(JSON.stringify(req.body));
  childProcess.on("Message", function (Message)  {console.log("ok " + Message);})
  //childProcess.on("Message", (Message) => {console.log("ok " + Message);})
  

  //console.log("webhook event received!", req.query, req.body);
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