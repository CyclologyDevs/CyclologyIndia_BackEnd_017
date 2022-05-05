const express = require('express');
const db = require('../config/database');   //For DataBase Connection
require("dotenv").config();


isInEvent = async (req, res, next) => {
    let { uuid, athlete_id, event_name } = req.body;


    db.all(`SELECT * from event WHERE uuid = ? AND athlete_id = ? AND event_name = ?`,[uuid, athlete_id, event_name], (err, data) => {
        if (err) 
          return res.status(400).json({ "error": err.message });

          console.log(data);
          console.log(uuid, athlete_id, event_name)

        if(data.length == 0)
            return res.status(400).send("NOT in EVENT");
        else
            return res.status(200).send("In EVENT");
    })
}



module.exports = {isInEvent};