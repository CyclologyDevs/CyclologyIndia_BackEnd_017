// Imports dependencies for sqlite3
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

// creates sqlite3 OBJ
const db = new sqlite3.Database("./cyclology.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err)
      return console.error(err.message);
      console.log("Data-Base Connected Successfully!");
  });

module.exports = db;


/*
let db = new sqlite3.Database("usersdb.sqlite", (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    } 
    else {        
        
        db.run(`CREATE TABLE users (
            uuid INTEGER PRIMARY KEY,
            fname STRING,
            lname STRING,  
            athlete_id	INTEGER,
	          refresh_token	INTEGER,
	          access_token	INTEGER,
	          access_token_expiration	INTEGER,
              token TEXT,
	          salt	TEXT,
	          email	TEXT,
	          password	TEXT,
            phone_number	NUMERIC,
	          gender	STRING,
	          age	INTEGER,
	          date_of_birth	DATE,
	          blood_group	TEXT,	
	          emergency_contact	NUMERIC,
	          relation_emergency_contact	STRING,
            occupation	STRING,
	          insta_link	TEXT,
	          facebook_link	TEXT,
	          twitter_link	TEXT,
	          linkdin_link	TEXT,
	          about_you	TEXT,
	          accident_insurance_number	TEXT
     
            DateLoggedIn DATE,
            DateCreated DATE
            )`,

            `CREATE TABLE Blogs (
              Id INTEGER PRIMARY KEY AUTOINCREMENT,
              name STRING,
              description TEXT,  
              DateCreated DATE
              )`,

        (err) => {
            if (err) {
                // Table already created
            } else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO Users (fname, lname, Email, Password, phone, alternativephone, personrelatedalternativephone, gender, DOB, Occupation, DateCreated) VALUES (?,?,?,?,?,?,?,?,?,?,?)'
                db.run(insert, ["Rajdeep", "Sarkar", "rs@gmail.com", bcrypt.hashSync("raju100", salt), 8100020030, 100, "Father", "M", "14/04/2002", "Student", Date('now')])
                db.run(insert, ["Subham", "Bhatt", "sb@gmail.com", bcrypt.hashSync("subh100", salt), 8100025000, 200, "Mother", "M", "14/0282002", "Student", Date('now')])
                db.run(insert, ["Aritra", "Chaterjee", "ac@gmail.com", bcrypt.hashSync("aritra100", salt), 8100040030, 300, "Brother", "M", "14/03/2002", "Student", Date('now')])
                db.run(insert, ["Dhruv", "Roy", "dr@gmail.com", bcrypt.hashSync("dhruv100", salt), 8100050030, 400, "Sister", "M", "14/01/2002", "Student", Date('now')])
            }
        });  
    }
});


module.exports = db;
*/

