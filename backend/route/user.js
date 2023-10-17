
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
console.log("This is edlin's user route");


//router for player POST
//test postman http://localhost:3000/api/userRoute DO NOT FORGET API 
router.post('/', (req, res) => {
  //code assigns each value from the body object to variables
  // in the const bracket below
  const { attack_type, health, moves_left, status, power } = req.body;
  //using this to send queries/commands to a database connection
  //to execute database operations
  connection.query(
    //Query to insert data into the table in mysql for POST
    'INSERT INTO User (attack_type, health, moves_left, status, power) VALUES (?,?,?,?,?)',
    [attack_type, health, moves_left, status, power],
    (error, results, fields) => {
      //checking for error
      if (error) {
        console.error(error);
        //server error on status 500
        //and it will send an error
        res.status(500).send('Error');
      } else {
        //if successful, server status shows 201
        //and it will send a message
        res.status(201).send('Player created successfully!');
      }

    }
  )
});

// GET for ALL players
router.get('/', (req, res) => {

  //using this to send queries/commands to a database connection
  //to execute database operations
  connection.query(
    //query to select only one table
    'SELECT * FROM User', (error, results, fields) => {
      //checks for error
      if (error) {
        console.log("can't GET players");
      } else {
        //successful will send results
        res.status(200).json(results);
      }
    });
});

//GET player by ID
router.get('/:id', (req, res) => {
  //the const variable playerId is assigned to a id parameter
  const playerId = req.params.id;
  //using this to send queries/commands to a database connection
  //to execute database operations
  connection.query(
    //SELECT table from database only based on ID
    'SELECT * FROM User WHERE player_id = ?', [playerId],
    (error, results, fields) => {
      //checks for server error
      if (error) {
        res.status(500).send();
        //else if to check if results array has result of 0
      } else if (results.length === 0) {
        //of not it will console log player not found
        console.log('player id not found');
        //hence will spawn a server status 404 not found
        //this can be checked in the web browser in chrome web 
        //developer tools
        res.status(404).send(`player ${playerId} error`);
      } else {
        //successful will send results
        res.status(200).json(results);
      }
    }
  );
});

// PUT player by ID 
//we update the id by adding '/:id' to make it easier for PUT updates
router.put('/:id', (req, res) => {
  //the const variable playerId is assigned to a id parameter
  const playerId = req.params.id;
  //code assigns each value from the body object to variables
  // in the const bracket below
  const { attack_type, health, moves_left, status, power } = req.body;
  //using this to send queries/commands to a database connection
  //to execute database operations
  connection.query(
    //Update by id to update the entire info
    'UPDATE User SET attack_type=?, health=?, moves_left=?, status=?, power=? WHERE player_id=?',
    [attack_type, health, moves_left, status, power, playerId],
    (error, results, fields) => {
      //checks for error
      if (error) {
        console.error(error);
         //server error on status 500
        //and it will send an error
        res.status(500).send('cannot update');
      } else {
         //if successful, server status shows 200
        //and it will send a message
        res.status(200).send('Player updated successfully');
      }
    }
  );
});

// DELETE player by ID

//using '/:id' will help to delete player solely by ID only to delete the 
//entire existing row under that id
router.delete('/:id', (req, res) => {
  //the const variable playerId is assigned to a id parameter
  const playerId = req.params.id;
  //using this to send queries/commands to a database connection
  //to execute database operations
  connection.query('DELETE FROM User WHERE player_id=?', [playerId], (error, results, fields) => {
    if (error) {
      console.error(error);
       //server error on status 500
        //and it will send an error
      res.status(500).send('Error deleting player');
    } else {
       //if successful, server status shows 200
        //and it will send a message
      res.status(200).send('Player deleted successfully');
    }
  });
});

//This is to export router to make it avail for use in other parts
//of the app
module.exports = router;