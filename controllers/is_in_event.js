const express = require('express');
const db = require('../config/database');   //For DataBase Connection
require("dotenv").config();


isInEvent = async (req, res, next) => {
    let { uuid, athlete_id, event_name } = req.body;


    db.all(`SELECT * from event WHERE uuid = ? AND athlete_id = ? AND event_name = ?`,[uuid, athlete_id, event_name], (err, data) => {
        if (err) 
          return res.status(400).json({ "error": err.message });

        if(data.length == 0)
            res.status(400).send("NOT in EVENT");
        else
        res.status(200).send("In EVENT");
    })
}



module.exports = {isInEvent};