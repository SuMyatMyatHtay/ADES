const express = require("express");
const router = express.Router();
const connection = require('../db'); //Import from db.js
const { parse } = require("dotenv");
console.log(" clanpoints route");

//get top clans for leaderboard as first, second, third 
//(#in the leaderBoard table,there may be more than three clans because the clans may have same points)
router.get('/topClans', async (req, res, next) => {
const SQLSTATEMENT = `
    select 
    clan.clanName,ip.clan_point  
from 
    (select 
        cp.clanID, c.clan_point 
    from 
        clan_point cp,
        (SELECT 
            DISTINCT clan_point 
        FROM 
            clan_point a 
        WHERE 
            3 >= (SELECT COUNT(DISTINCT clan_point) FROM clan_point b WHERE b.clan_point >= a.clan_point) 
        ORDER BY a.clan_point DESC) c
    where cp.clan_point = c.clan_point
    order by 2 desc) ip ,
    clan 
where 
    clan.clanID = ip.clanID;    
    `;
    
connection.promise().query(SQLSTATEMENT)
.then(([rows, fields]) => {
       
        const uniqueClanPoints = [...new Set(rows.map(entry => entry.clan_point))];
        console.log(uniqueClanPoints);

        // Group the clans as first, second, and third
        const firstClans = [];
        const secondClans = [];
        const thirdClans = [];

        let data =  {firstClans,secondClans,thirdClans};
        

        for (const entry of rows) {
        if (firstClans.length == 0 || entry.clan_point == uniqueClanPoints[0]) {
            firstClans.push({clanName:entry.clanName,clanPoint:uniqueClanPoints[0]});
        } else if (secondClans.length == 0 || entry.clan_point == uniqueClanPoints[1]) {
            secondClans.push({clanName:entry.clanName,clanPoint:uniqueClanPoints[1]});
        } else if (thirdClans.length == 0 || entry.clan_point == uniqueClanPoints[2]) {
            thirdClans.push({clanName:entry.clanName,clanPoint:uniqueClanPoints[2]});
        }
        }
       console.log(data);
        res.status(200).send(data);
        res.end();
            })
.catch((error) => {
        console.log(error)
        res.send(error);
        });
   
});


//update clan point after playing mini-game
router.put('/increaseClanPoints', (req, res, next) => {
    let clanID = req.body.clanID;
    parse_clanID = parseInt(clanID);
    let scores = req.body.scores;
    parse_scores= parseInt(scores);

    console.log(parse_clanID,parse_scores);

    const SQLSTATEMENT = `
    update clan_point 
    set clan_point= clan_point + ${parse_scores} , points_added = ${parse_scores} 
    where clanID=${parse_clanID};     
    `;
    const VALUES = [parse_scores, parse_clanID];

    connection.promise().query(SQLSTATEMENT, VALUES)
        .then(([rows, fields]) => {
            console.log(rows);
            res.json(rows);
        })
        .catch((error) => {
            console.log(error)
            res.send(error);
        });
})

//also insert a new row in the mini-game history after playing mini-game
//to know 'who got how many points on which day'
router.post('/updateInGameHistory',(req, res, next) => {
    let player_ID = req.body.playerID;
    parse_player_ID = parseInt(player_ID)
    let clanID = req.body.clanID;
    parse_clanID = parseInt(clanID);
    let score = req.body.points;
    parse_score = parseInt(score);

    const SQLSTATEMENT = `
    insert into mini_game
    (player_ID,points_received,clanID)
    values(${parse_player_ID},${parse_score},${parse_clanID});
       
    `;
    const VALUES = [parse_player_ID,parse_score,parse_clanID];

    connection.promise().query(SQLSTATEMENT, VALUES)
        .then(([rows, fields]) => {
            console.log(rows);
            res.json(rows);
        })
        .catch((error) => {
            console.log(error)
            res.send(error);
        });

})

//to increase players' gold
router.put('/increasePlayerGold', (req, res, next) => {
    let playerID = req.body.playerID;
    parse_playerID = parseInt(playerID);
    let scores = req.body.points;
    parse_scores= parseInt(scores);

    console.log(parse_playerID,parse_scores);

    const SQLSTATEMENT = `
    update player
    set gold = gold+${parse_scores}
    where player_id=${parse_playerID}; 
    `;
    const VALUES = [parse_scores, parse_playerID];

    connection.promise().query(SQLSTATEMENT, VALUES)
        .then(([rows, fields]) => {
            console.log(rows);
            res.json(rows);
        })
        .catch((error) => {
            console.log(error)
            res.send(error);
        });
})

//to increae player history
router.post("/updatePlayerHistory", (req, res, next) => {
    let playerID = req.body.playerID;
    parse_playerID = parseInt(playerID);
    let scores = req.body.points;
    parse_scores = parseInt(scores);
    let game_id = req.body.gameID;
    parse_game_id = parseInt(game_id);
    console.log(parse_playerID, parse_scores,parse_game_id);
  
    const SQLSTATEMENT = `
        insert 
        into minigames_player_history
        (player_id,scores,game_id)
        values
        (${parse_playerID},${parse_scores},${parse_game_id});
      `;
    const VALUES = [parse_playerID,parse_scores,parse_game_id];
  
    connection
      .promise()
      .query(SQLSTATEMENT, VALUES)
      .then(([rows, fields]) => {
        console.log(rows);
        res.json(rows);
      })
      .catch((error) => {
        console.log(error);
        res.send(error);
      });
  });

  router.put('/updateClanPoints', (req, res, next) => {
    let clanID = req.body.clanID;
    parse_clanID = parseInt(clanID);
    let updatedClanPoints = req.body.updatedClanPoints;
    parse_updatedClanPoints= parseInt(updatedClanPoints);

    console.log(parse_clanID,parse_updatedClanPoints);

    const SQLSTATEMENT = `
    update clan_point
    set clan_point =${parse_updatedClanPoints}
    where clanID = ${parse_clanID};    
    `;
    const VALUES = [parse_updatedClanPoints, parse_clanID];

    connection.promise().query(SQLSTATEMENT, VALUES)
        .then(([rows, fields]) => {
            console.log(rows);
            res.json(rows);
        })
        .catch((error) => {
            console.log(error)
            res.send(error);
        });
})

module.exports = router;