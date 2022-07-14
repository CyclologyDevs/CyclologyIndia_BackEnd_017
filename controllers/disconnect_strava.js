const express = require('express');
const db = require('../config/database');   //For DataBase Connection
require("dotenv").config();

  disConnectStrava = async (req, res, next) => {
    const { uuid, email, athlete_id } = req.body;

    db.all(`SELECT * FROM users WHERE uuid = ? AND email = ?;`, [uuid,email], async (err, data, fields) => {
        if (err) {
          console.log("Error Occured while Strava Disconnect -DB for UUID",uuid)
          console.error(err.message);
          return res.status(500).send("Error Occured while Strava Disconnect -DB for UUID ",uuid)
        }

        if(data.length == 0) {
          console.log("No User Found with UUID =",uuid,"Email =",email)
          return res.status(400).send("USER NOT FOUND!")
        }

        else if(data[0].athlete_id == null) {

            console.log("Strava Already DisConnected for UUID =",uuid,"Email =",email)
            return res.status(400).send("Strava Already DisConnected!")
        } else {
            
            let sql = `UPDATE users SET athlete_id = NULL, refresh_token = NULL, access_token = NULL, access_token_expiration = NULL WHERE uuid = ? AND email = ?`;
            let params = [uuid, email]
            db.run(sql,params, (err) => {
                if(err) {
                    console.log("Error Occured while Strava Disconnect DELETE -DB for UUID",uuid)
                    console.error(err.message);
                    return res.status(500).send("Error Occured while Strava Disconnect DELETE -DB for UUID ",uuid)
                }

                console.log("Strava DisConnected for UUID =",uuid,"Email =",email)
                return res.status(200).json({"msg": "Strava DisConnected Successfully!"});

            } )
        }
    })
  }


  module.exports = {disConnectStrava};