
//it imports express into the node application that allows us to create
//web server using API
const express = require('express');
//creates an instance of the router class that is provided by Express
//that we can use to define routes for our web server
const router = express.Router();
//statements connects to our backend thru using ORM that requires the path
//'../db' since it is located one level up relative to where this file 
//resides
const connection = require('../db'); //Import from db.js
//console log message used for testing when running under npm run dev

console.log("This is edlin's battle points route");



//this allows me to define routes based on the http methods within the CRUD
router.post('/', (req, res) => {
  //this const distributes specified data from the req to variables for later
  //uses
  const { player_id, adversary_id, winner, location } = req.body;
  //a variable for current date and time
  const time = new Date();

  //using this to send queries/commands to a database connection
  //to execute database operations
  connection.query(
    //SQL statement to insert data
    'INSERT INTO Battle_Points (player_id, adversary_id, winner, location, time) VALUES (?,?,?,?,?)',
    [player_id, adversary_id, winner, location, time],
    (error, results, fields) => {
      //if checks if there is error
      if (error) {
        //if not it will console log error
        console.log(error);
        res.status(500).send('Error');
      } else {
        //when it is successful, it will send 201 server status and send a message
        res.status(201).send('Battle points created successfully!');
      }
    }
  )
});

// GET for ALL battle points table 
router.get('/', (req, res) => {
  //using this to send queries/commands to a database connection
  //to execute database operations
  connection.query
  //using a SELECT statement query to get data from Battle_Points
  //table
    ('SELECT * FROM  Battle_Points', (error, results, fields) => {
      //checks for error
      if (error) {
        console.log(error);
        console.log("can't GET Battle_Points");
      } else {
        //when successful it should show server status 200
        res.status(200).json(results);
      }
    });
});

//This is to export router to make it avail for use in other parts
//of the app

module.exports = router;