const express = require('express');
const router = express.Router();
const connection = require('../db'); //Import from db.js
console.log("This is edlin's route joining");


//test postman http://localhost:3000/api/playURoute
router.post('/' , (req, res) => {
  const playerUsername = req.body.username;
  console.log(playerUsername)
connection.query(` 
SELECT 
player.player_id AS yourID, 
player.player_username AS Username, 
count(User.player_id) AS Created, 
sum(player.gold) AS yourPoints
from player
left join User ON player.player_id = User.player_id
WHERE player.player_username = ?
group by player.player_id`,[playerUsername]
, (error, results, fields) => {
  if(error){
    console.log(error);
    console.log("can't GET players");
  } else {
    res.status(200).json(results);
  }
});
});

//TO JOIN EXAMPLE FROM DENG NOTES 

// select p.player_id, pu.player_username
// from player
// join 
// on 

module.exports = router;




