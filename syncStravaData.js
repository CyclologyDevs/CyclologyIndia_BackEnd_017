// Imports dependencies and DataBase
require("dotenv").config();
const db = require('./config/database');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));  // Com/on JS


let sql = `SELECT users.uuid, users.athlete_id, users.refresh_token, users.access_token, users.access_token_expiration, event.event_start_date, event.event_end_date, event.event_name FROM users JOIN event ON users.uuid = event.uuid WHERE event_end_date > DATE('now') GROUP BY users.uuid ORDER BY event.event_start_date DESC;`;
let params = [];

db.all(sql, params, (err, data) => {
    if (err) {
        console.log("Error Occured while SyncStavaData start -DB")
        console.error(err.message);
        return res.status(500).send("Error Occured while fetch old activities start -DB")
    }

    data.forEach( async (user) => {
        console.log("SyncStavaData started for uuid", user.uuid)
        

        let dateNow = new Date();
        dateNow = dateNow.getTime();
        dateNow = Math.floor(dateNow / 1000);
        let expDate = user.access_token_expiration;

        if(expDate < dateNow || user.access_token==null || user.access_token_expiration==null)
        {
          await getAccessToken(user ,user.refresh_token, stravaApiCall);
        }
        else
        {
          await  stravaApiCall(user ,user.access_token, insertActivitiesIntoStravaTable);
        }
        
    })

})


async function getAccessToken(user, refresh_token,callback_stravaApiCall) {
    
    const headers = {
      'Accept' : 'application/json, text/plain, */*',
      'Content-Type' : 'application/json'
    } 
  
    const body = JSON.stringify({
      client_id : process.env.Client_ID,
      client_secret : process.env.Client_Secret,
      refresh_token : refresh_token,
      grant_type : 'refresh_token',
    })
  
    const reAuthorizeResponse = await fetch('https://www.strava.com/oauth/token', {
      method : 'POST',
      "headers" : headers,
      "body" : body,
    })
  
    const reAuthResJson = await reAuthorizeResponse.json();
  
  
    let sql = 'UPDATE users SET access_token = ?, access_token_expiration = ? WHERE athlete_id = ? ';
    let params = [reAuthResJson.access_token, reAuthResJson.expires_at, user.athlete_id];
  
    db.run(sql, params, (err) => {
      if (err) {
        console.log("Error Occured while SyncStravaData getAccessToken -DB for uuid",user.uuid)
        console.error(err.message);
        return res.status(500).send("Error Occured while fetch old activities getAccessToken -DB for for uuid",user.uuid)
      }
  
        callback_stravaApiCall(user ,reAuthResJson.access_token, insertActivitiesIntoStravaTable);
  })
  }


async function stravaApiCall(user, access_token,callback_insertActivitiesIntoStravaTable) {
    
    let tdate = Date.now();
    let fdate = user.event_start_date;
    tdate = await epoch(tdate);
    fdate = await epoch(fdate);

    const response = await fetch(`https://www.strava.com/api/v3/athlete/activities?before=${tdate}&after=${fdate}&page=1&per_page=90&access_token=${access_token}`);
    const json = await response.json();

    var json1 = []
      for (const keys in json)
      {
          if (json[keys].from_accepted_tag == process.env.from_accepted_tag && json[keys].type == process.env.type  && json[keys].manual == process.env.manual) 
          {
              temp = {
                id: json[keys].id,
                activity_name: json[keys].name,
                average_speed: json[keys].average_speed,
                max_speed: json[keys].max_speed,
                distance: json[keys].distance,
                moving_time: json[keys].moving_time,
                start_date_local: await changeDatetimeToDate (json[keys].start_date_local),
                start_date_local_epoch: json[keys].start_date_local,
                total_elevation_gain: json[keys].total_elevation_gain,
                timezone: json[keys].timezone,
              }
              json1.push(temp);
          }
      }
    

    if (json1.length !== 0)
      await callback_insertActivitiesIntoStravaTable(user,json1);
  }

async function insertActivitiesIntoStravaTable(user, json) {
    const sql = 'INSERT OR REPLACE INTO strava (uuid,athlete_id, activity_id, activity_name, average_speed, distance, elapsed_time, max_speed, moving_time, start_date_local, start_date_local_epoch, total_elevation_gain) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)';
    let params;

    json.forEach( (json) => {
        params = [user.uuid, user.athlete_id, json.id, json.activity_name, json.average_speed, json.distance, json.elapsed_time, json.max_speed, json.moving_time, json.start_date_local, json.start_date_local_epoch, json.total_elevation_gain];
    
        db.run(sql, params, err => {
          if (err) {
            console.log("Error Occured while SyncStravaData insertActivitiesIntoStravaTable -DB for uuid",user.uuid)
            console.error(err.message);
            return res.status(500).send("Error Occured while SyncStravaData insertActivitiesIntoStravaTable -DB for uuid",user.uuid)
          }
        })
    })

    console.log("SyncStravaData DONE for uuid",user.uuid);
  }


function epoch(dateString) {
    let someDate = new Date(dateString);
    someDate = someDate.getTime();   // geting someDate in Milli-Second
    someDate = someDate - 18000000 - 1800000 - 1000  // IST to GMT (-5hr -30min -1Sec)
    someDate = someDate/1000;     // Converting Mili-Second to Second (1 Milli-Second = 1000 Second)
    return someDate;
}

function changeDatetimeToDate(json1)
{
    for (const keys in json1)
    {
        d = new Date(json1[keys].start_date);
        json1[keys].start_date = d.toDateString();

        d = new Date(json1[keys].start_date_local);
        json1[keys].start_date_local = d.toDateString();

        // console.log("Start Date = " + json1[keys].start_date);
        // console.log("Start Date Local = " + json1[keys].start_date_local);
    }
}


      
      
    
