const express = require('express');
const router = express.Router();
const db = require('../config/database');   //For DataBase Connection
const path = require('path');
require("dotenv").config();



// this script to fetch data from MySQL databse table
router.get('/event1', function(req, res, next) {
  var sql = `SELECT users.fname, users.lname, users.uuid, strava.athlete_id, SUM(strava.distance) as t_distance FROM users JOIN strava ON users.athlete_id = strava.athlete_id WHERE strava.start_date_local_epoch BETWEEN ? AND ? GROUP BY strava.athlete_id ORDER BY t_distance DESC;`;
    //var sql = `SELECT users.fname, users.lname, strava.athlete_id, SUM(strava.distance) as T_Distance FROM users JOIN strava ON users.athlete_id = strava.athlete_id WHERE strava.start_date_local_epoch BETWEEN ? AND ? GROUP BY strava.athlete_id ORDER BY T_Distance DESC;`;
    //var sql = `SELECT users.fname, users.lname, strava.athlete_id, strava.start_date_local, strava.start_date_local_epoch, SUM(strava.distance) as Distance FROM users JOIN strava ON users.athlete_id = strava.athlete_id WHERE strava.start_date_local_epoch BETWEEN ? AND ? GROUP BY strava.athlete_id, strava.start_date_local_epoch`;
    var params = [process.env.event1Start, process.env.event1End];
    //${process.env.event1Start} AND ${process.env.event1End}
    //"2021-06-06" AND "2021-06-09"


    db.all(sql,params, (err, data, fields) => {
    if (err) 
        return console.error(err.message);
    //throw err;

    {
      var start_date = "";
      let start = new Date (process.env.event1Start);
      day = start.getDate();
      month = start.getMonth()
      year = start.getFullYear()

      if((day%10)==1)
        start_date += day+"st ";
      else if((day%10)==2)
        start_date += day+"nd ";
      else if((day%10)==3)
        start_date += day+"rd ";
      else
        start_date += day+"th ";

      if (month == 0)
        start_date += "Jan "
      else if (month == 1)
        start_date += "Feb "
      else if (month == 2)
        start_date += "Mar"
      else if (month == 3)
        start_date += "Apr "
      else if (month == 4)
        start_date += "May "
      else if (month == 5)
        start_date += "Jun "
      else if (month == 6)
        start_date += "Jul "
      else if (month == 7)
        start_date += "AUG "
      else if (month == 8)
        start_date += "Sep "
      else if (month == 9)
        start_date += "Oct "
      else if (month == 10)
        start_date += "Nov "
      else if (month == 11)
        start_date += "Dec "

      start_date += year;
    }

    {
      var end_date = "";
      let end = new Date (process.env.event1End);
      day = end.getDate();
      month = end.getMonth()
      year = end.getFullYear()

      if((day%10)==1)
        end_date += day+"st ";
      else if((day%10)==2)
        end_date += day+"nd ";
      else if((day%10)==3)
        end_date += day+"rd ";
      else
        end_date += day+"th ";

      if (month == 0)
        end_date += "Jan "
      else if (month == 1)
        end_date += "Feb "
      else if (month == 2)
        end_date += "Mar"
      else if (month == 3)
        end_date += "Apr "
      else if (month == 4)
        end_date += "May "
      else if (month == 5)
        end_date += "Jun "
      else if (month == 6)
        end_date += "Jul "
      else if (month == 7)
        end_date += "AUG "
      else if (month == 8)
        start_date += "Sep "
      else if (month == 9)
        end_date += "Oct "
      else if (month == 10)
        end_date += "Nov "
      else if (month == 11)
        end_date += "Dec "

      end_date += year;
    }

    res.render('event-list', { title: 'EVENT 1 Total kilometer in 7days', usersData: data, start_date: start_date, end_date: end_date});
  });
});

router.get(`/event001`, function(req, res, next) {
  var sql = `SELECT users.fname, users.lname, users.uuid, strava.athlete_id, SUM(strava.distance) as T_Distance FROM users JOIN strava ON users.athlete_id = strava.athlete_id WHERE strava.start_date_local_epoch BETWEEN ? AND ? GROUP BY strava.athlete_id ORDER BY T_Distance DESC;`;
  //var sql = `SELECT users.fname, users.lname, strava.athlete_id, strava.start_date_local, strava.start_date_local_epoch, SUM(strava.distance) as Distance FROM users JOIN strava ON users.athlete_id = strava.athlete_id WHERE strava.start_date_local_epoch BETWEEN ? AND ? GROUP BY strava.athlete_id, strava.start_date_local_epoch`;
  var params = [process.env.event1Start, process.env.event1End];

  db.all(sql,params, (err, data, fields) => {
  if (err) 
      return console.error(err.message);
  //throw err;
  //res.send(data[0]);
  res.status(200).send(data);
});
});

router.get('/event2', function(req, res, next) {
  var sql = `SELECT fname,lname,uuid,athlete_id, SUM(T_Distance) as t_distance FROM (SELECT users.fname, users.lname, users.uuid, strava.athlete_id, MAX(strava.distance) as t_distance FROM users JOIN strava ON users.athlete_id = strava.athlete_id WHERE strava.start_date_local_epoch BETWEEN ? AND ? GROUP BY strava.start_date_local, strava.athlete_id) GROUP BY athlete_id ORDER BY t_distance DESC;`;
  var params = [process.env.event2Start, process.env.event2End];

  db.all(sql,params, (err, data, fields) => {
  if (err) 
      return console.error(err.message);
  //throw err;

  {
    var start_date = "";
    let start = new Date (process.env.event2Start);
    day = start.getDate();
    month = start.getMonth()
    year = start.getFullYear()

    if((day%10)==1)
      start_date += day+"st ";
    else if((day%10)==2)
      start_date += day+"nd ";
    else if((day%10)==3)
      start_date += day+"rd ";
    else
      start_date += day+"th ";

    if (month == 0)
      start_date += "Jan "
    else if (month == 1)
      start_date += "Feb "
    else if (month == 2)
      start_date += "Mar"
    else if (month == 3)
      start_date += "Apr "
    else if (month == 4)
      start_date += "May "
    else if (month == 5)
      start_date += "Jun "
    else if (month == 6)
      start_date += "Jul "
    else if (month == 7)
      start_date += "AUG "
    else if (month == 8)
      start_date += "Sep "
    else if (month == 9)
      start_date += "Oct "
    else if (month == 10)
      start_date += "Nov "
    else if (month == 11)
      start_date += "Dec "

    start_date += year;
  }

  {
    var end_date = "";
    let end = new Date (process.env.event2End);
    day = end.getDate();
    month = end.getMonth()
    year = end.getFullYear()

    if((day%10)==1)
      end_date += day+"st ";
    else if((day%10)==2)
      end_date += day+"nd ";
    else if((day%10)==3)
      end_date += day+"rd ";
    else
      end_date += day+"th ";

    if (month == 0)
      end_date += "Jan "
    else if (month == 1)
      end_date += "Feb "
    else if (month == 2)
      end_date += "Mar"
    else if (month == 3)
      end_date += "Apr "
    else if (month == 4)
      end_date += "May "
    else if (month == 5)
      end_date += "Jun "
    else if (month == 6)
      end_date += "Jul "
    else if (month == 7)
      end_date += "AUG "
    else if (month == 8)
      start_date += "Sep "
    else if (month == 9)
      end_date += "Oct "
    else if (month == 10)
      end_date += "Nov "
    else if (month == 11)
      end_date += "Dec "

    end_date += year;
  }

    res.render('event-list', { title: 'EVENT 2 Total kilometer in 7days (1day 1activity)', usersData: data, start_date: start_date, end_date: end_date});
});
});

router.get('/event002', function(req, res, next) {
  var sql = `SELECT fname,lname,uuid,athlete_id, SUM(T_Distance) as T_Distance FROM (SELECT users.fname, users.lname, users.uuid, strava.athlete_id, MAX(strava.distance) as T_Distance FROM users JOIN strava ON users.athlete_id = strava.athlete_id WHERE strava.start_date_local_epoch BETWEEN ? AND ? GROUP BY strava.start_date_local, strava.athlete_id) GROUP BY athlete_id ORDER BY T_Distance DESC;`;
  var params = [process.env.event2Start, process.env.event2End];

  db.all(sql,params, (err, data, fields) => {
  if (err) 
      return console.error(err.message);
  //throw err;

   //res.send(data[0]);
   res.status(200).send(data);
});
});

router.get('/event003', function(req, res, next) {
  var sql = `SELECT users.fname, users.lname, users.uuid, strava.athlete_id, SUM(strava.distance) as T_Distance FROM users JOIN strava ON users.athlete_id = strava.athlete_id WHERE strava.start_date_local_epoch BETWEEN ? AND ? GROUP BY strava.athlete_id ORDER BY T_Distance DESC;`;
  var params = [process.env.event3Start, process.env.event3End];

  db.all(sql,params, (err, data, fields) => {
  if (err) 
      return console.error(err.message);
  //throw err;

   //res.send(data[0]);
   res.status(200).send(data);
});
});


module.exports = router;