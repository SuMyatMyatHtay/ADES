const express = require("express");
const router = express.Router();
const connection = require("../db"); //Import from db.js
console.log("This is settings for clan points route");

//to get a list of clans for each player
router.get("/listOfClans/:player_id", (req, res, next) => {
  let player_id = req.params.player_id;
  let parse_player_id = parseInt(player_id);
  const SQLSTATEMENT = `
    select cm.ClanID, c.ClanName,cm.date_joined from clanmates cm ,clan c 
    where cm.player_id= ${parse_player_id}
    and cm.ClanID = c.ClanID
    order by cm.date_joined;
         
    `;
  const VALUES = [parse_player_id];

  connection
    .promise()
    .query(SQLSTATEMENT, VALUES)
    .then(([rows, fields]) => {
      let jsonData = [];
      for (let i = 0; i < rows.length; i++) {
        jsonData.push({
          clanID: rows[i].ClanID,
          clan_name: rows[i].ClanName,
        });
      }
      console.log(jsonData);
      res.status(200).send(jsonData);
      res.end();
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});

//get clan name and its points
router.get("/clanInformation/:clanID", (req, res, next) => {
  let clanID = req.params.clanID;
  parse_clanID = parseInt(clanID);
  console.log(parse_clanID);

  const SQLSTATEMENT = `
    select c.ClanName, cp.clan_point 
    from clan_point cp, clan c
    where c.ClanID =${parse_clanID}
    and c.ClanID = cp.ClanID;
    
    `;
  const VALUES = [parse_clanID];

  connection
    .promise()
    .query(SQLSTATEMENT, VALUES)
    .then(([rows, fields]) => {
      let jsonData = {
        clanName: rows[0].ClanName,
        clanPoint: rows[0].clan_point,
      };

      console.log(jsonData);
      res.status(200).send(jsonData);
      res.end();
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});


//to get name of player who got highest points from mini-game
router.get("/topPlayer/:clanID", (req, res, next) => {
  let clanID = req.params.clanID;
  parse_clanID = parseInt(clanID);
  //console.log(parse_player_id);

  const SQLSTATEMENT = `
    select 
        a.topPlayerPoints, p.player_username 
    from
        (select 
            sum(points_received) as 'topPlayerPoints',player_ID 
        from 
            mini_game
        where 
            clanID= ${parse_clanID}
        group by player_ID
        order by 1 desc
        limit 1) a, player p
    where 
        a.player_ID =p.player_id;
         
    `;
  const VALUES = [parse_clanID];

  connection
    .promise()
    .query(SQLSTATEMENT, VALUES)
    .then(([rows, fields]) => {
      console.log(rows);
      let jsonData = [];
      for (let i = 0; i < rows.length; i++) {
        jsonData.push({
          player_username: rows[i].player_username,
          topPlayerPoints: rows[i].topPlayerPoints,
        });
      }
      res.status(200).send(jsonData);
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});


//get clan mamber names and their role
router.get("/ClanMemberDetails/:clanID", (req, res, next) => {
  let clanID = req.params.clanID;
  parse_clanID = parseInt(clanID);

  const SQLSTATEMENT = `
    select p.player_username, cm.playerRole , cm.date_joined
    from clanmates cm, player p
    where clanID=${parse_clanID}
    and p.player_id = cm.player_id
    order by 1;
         
    `;
  const VALUES = [parse_clanID];

  connection
    .promise()
    .query(SQLSTATEMENT, VALUES)
    .then(([rows, fields]) => {
      let jsonData = [];
      for (let i = 0; i < rows.length; i++) {
        jsonData.push({
          player_username: rows[i].player_username,
          Role: rows[i].playerRole,
          date_joined: rows[i].date_joined,
        });
      }
      console.log(jsonData);
      res.status(200).send(jsonData);
      res.end();
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});

//get the number of matches of players during this year to draw bar chart
//*also display as zreo for the players who never play mini-game
router.get("/playersAndtheirMatches/:clanID", (req, res, next) => {
  let clanID = req.params.clanID;
  parse_clanID = parseInt(clanID);
  const SQLSTATEMENT = `
  select p.player_username,a.points from 
  player p,
  (SELECT clanmates.player_id,  count(mini_game.points_received) as points
  FROM clanmates
  LEFT JOIN mini_game ON clanmates.clanID = mini_game.clanID
  AND Year(dateAndTime) = YEAR(CURDATE())
  AND clanmates.player_id = mini_game.player_id
  WHERE clanmates.clanID =${parse_clanID}
  group by player_id)a
  where p.player_id = a.player_id;
         
    `;
  const VALUES = [parse_clanID];

  connection
    .promise()
    .query(SQLSTATEMENT, VALUES)
    .then(([rows, fields]) => {
      let jsonData = [];
      for (let i = 0; i < rows.length; i++) {
        jsonData.push({
          player_username: rows[i].player_username,
          points: parseInt(rows[i].points),
        });
      }

      res.status(200).send(jsonData);
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});

//to get player gold
router.get("/playergold/:playerID", (req, res, next) => {
  let playerID = req.params.playerID;
  parse_playerID = parseInt(playerID);
  console.log(parse_playerID);

  const SQLSTATEMENT = `
  SELECT
      player_username,
      image_id,
      gold,
      DATE_FORMAT(date_created, '%M %Y') AS date_created
  FROM
      player
  WHERE
      player_id=${parse_playerID};
    
    `;
  const VALUES = [parse_playerID];

  connection
    .promise()
    .query(SQLSTATEMENT, VALUES)
    .then(([rows, fields]) => {
      let jsonData = {
        playerName: rows[0].player_username,
        playerGold: rows[0].gold,
        playerimageID: rows[0].image_id,
        playerdateCreated: rows[0].date_created,
      };

      console.log(jsonData);
      res.status(200).send(jsonData);
      res.end();
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});

//to get max scores from game 1
router.get("/playermaxscoresforgame1/:playerID", (req, res, next) => {
  let playerID = req.params.playerID;
  parse_playerID = parseInt(playerID);
  console.log(parse_playerID);

  const SQLSTATEMENT = `
  SELECT 
        COALESCE(MAX(scores), 0) AS max_score
  FROM 
        minigames_player_history
  WHERE 
        player_id = ${parse_playerID} AND game_id = 1;
    
    `;
  const VALUES = [parse_playerID];

  connection
    .promise()
    .query(SQLSTATEMENT, VALUES)
    .then(([rows, fields]) => {
      console.log(rows);
      let jsonData = {
       max_score_game1 : rows[0].max_score
      };

      console.log(jsonData);
      res.status(200).send(jsonData);
      res.end();
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});

//to get max scores from game 2
router.get("/playermaxscoresforgame2/:playerID", (req, res, next) => {
  let playerID = req.params.playerID;
  parse_playerID = parseInt(playerID);
  console.log(parse_playerID);

  const SQLSTATEMENT = `
  SELECT 
        COALESCE(MAX(scores), 0) AS max_score
  FROM 
        minigames_player_history
  WHERE 
        player_id = ${parse_playerID} AND game_id = 2;
    
    `;
  const VALUES = [parse_playerID];

  connection
    .promise()
    .query(SQLSTATEMENT, VALUES)
    .then(([rows, fields]) => {
      console.log(rows);
      let jsonData = {
       max_score_game2 : rows[0].max_score
      };

      console.log(jsonData);
      res.status(200).send(jsonData);
      res.end();
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});

module.exports = router;
