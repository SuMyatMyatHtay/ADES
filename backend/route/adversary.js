
const express = require('express');
const router = express.Router();
const connection = require('../db'); //Import from db.js

console.log("This is edlin's adversary route");

//NOTE: battle points still in progress to be added
//updated GET, and POST routes

//router for adversary POST
router.post('/', (req, res) => {
  //code assigns each value from the body object to variables
  // in the const bracket below
  const { attack_type, health, moves_left, status, power } = req.body;
  //using this to send queries/commands to a database connection
  //to execute database operations
  connection.query(
    //Query to insert data into the table in mysql
    'INSERT INTO adversary (attack_type, health, moves_left, status, power) VALUES (?,?,?,?,?)',
    [attack_type, health, moves_left, status, power],
    (error, results, fields) => {
      //checking for error
      if (error) {
        console.log(error);
        //server error on status 500
        //and it will send an error
        res.status(500).send('Error');
      } else {
        //if successful, server status shows 201
        //and it will send a message
        res.status(201).send('Adversary created successfully!');
      }
    }
  )
});

// GET for ALL adversary

//to GET all '/' and not using '/:id' instead
router.get('/', (req, res) => {
  //using this to send queries/commands to a database connection
  //to execute database operations
  connection.query(
    //using a SELECT statement query to get data from adversary
    //table
    'SELECT * FROM adversary', (error, results, fields) => {
      //checking for error
      if (error) {
        console.log(error);
        console.log("can't GET adversaries");
      } else {
        //if successful, server status shows 200
        res.status(200).json(results);
      }
    });

});

// GET adversary by ID
router.get('/:id', (req, res) => {
  const adversaryId = req.params.id
  //using this to send queries/commands to a database connection
  //to execute database operations
  connection.query(
    //using a SELECT statement query to get data from adversary
    //table only for ID
    'SELECT * FROM adversary WHERE adversary_id=?',
    [adversaryId],
    (error, results, fields) => {
      //check for error if not it'll send a message
      if (error) {
        console.log(error);
        console.log("can't GET adversary ID");
      } else {
        //if successful, server status shows 200
        res.status(200).json(results);
      }
    });
});

// PUT adversary by ID 
router.put('/:id', (req, res) => {
  const adversaryId = req.params.id;
  const { attack_type, health, moves_left, status, power } = req.body;

  //using this to send queries/commands to a database connection
  //to execute database operations

  connection.query(
    'UPDATE adversary SET attack_type=?, health=?, moves_left=?, status=?, power=? WHERE adversary_id=?',
    [attack_type, health, moves_left, status, power, adversaryId],
    (error, results, fields) => {

      //check for error if not it'll send a message
      if (error) {
        console.error(error);
        //if status 500 shown, it indicates a server error
        res.status(500).send('cannot update');
      } else {
        //if successful, server status shows 200
        //with a message 
        res.status(200).send('Adversary updated successfully');
      }
    }
  );
});

// DELETE adversary by ID

router.delete('/:id', (req, res) => {
  const adversaryId = req.params.id;
  //using this to send queries/commands to a database connection
  //to execute database operations
  connection.query(
    //DELETE queries from ID that clears the entire info within the table
    'DELETE FROM adversary WHERE adversary_id=?', [adversaryId], (error, results, fields) => {
      //check for error if not it'll send a message
      if (error) {
        console.error(error);
        //if status 500 shown, it indicates a server error
        res.status(500).send('Error deleting adversary');
      } else {
        //if successful, server status shows 200
        //with a message 
        res.status(200).send('Adversary deleted successfully');
      }
    });
});

//This is to export router to make it avail for use in other parts
//of the app

module.exports = router;