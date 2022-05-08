const express = require('express');
const db = require('../config/database');   //For DataBase Connection
require("dotenv").config();
const {fork} = require('child_process');   //For using Child Process


joinEvent = async (req, res, next) => {
    let { uuid, athlete_id, event_start_date, event_end_date, event_name } = req.body;

  const sql = `INSERT INTO event(uuid, athlete_id, event_start_date, event_end_date, event_name) VALUES(?,?,?,?,?);`;
  let params = [uuid, athlete_id, event_start_date, event_end_date,event_name];

  db.all(`SELECT * from event WHERE uuid = ? AND athlete_id = ? AND event_name = ?`,[uuid, athlete_id, event_name], (err, data) => {
    if (err) 
      return res.status(400).json({ "error": err.message });
    
    if (data.length == 0){
      db.all(sql,params, (err, data, fields) => {
        if (err)
          return res.status(400).json({ "error": err.message });
         
          
          console.error("Event Joint by Athlete =>  "+ uuid + " " + athlete_id);

        //Working with Child Process for Multi-ThreadingDefining Child Process
        const childProcess = fork('./controllers/fetchOldActivities.js');
        childProcess.send(JSON.stringify({uuid, athlete_id, event_start_date, event_end_date, event_name}));
        childProcess.on("Message", function (Message)  {console.log("ok " + Message);})
        //childProcess.on("Message", (Message) => {console.log("ok " + Message);})

          return res.status(200).send("EVENT JOINT SUCCESSFULLY!");
        })
    } else {
      return res.status(400).json({ "error": "user alredy have joint the event" });
    }
  })
}





  module.exports = {joinEvent};