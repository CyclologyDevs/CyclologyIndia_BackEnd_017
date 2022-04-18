const express = require('express');
const db = require('../config/database');   //For DataBase Connection
require("dotenv").config();


  async function strava(code, uuid, email) {
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
     
      res.status(200).send("Strava Connected Successfully!");
      console.log("Strava connected =>  "+ oAuthRes.athlete.id + " " + oAuthRes.refresh_token);
    }
  )
  } 
  

  connectStrava = async (req, res, next) => {
    const { code, uuid, email } = req.body;

    db.all(`SELECT * FROM users WHERE uuid = ? AND email = ?;`, [uuid,email], (err, data, fields) => {
        if (err)
            return console.error(err.message);

        if(data[0].athlete_id == null) {
            strava(code, uuid, email);
        } else {
            return res.status(400).send("Strava Already Connected!")
        }
    })
  }


  module.exports = {connectStrava};