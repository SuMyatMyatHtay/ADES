const express = require("express");
const router = express.Router();
const connection = require("../db"); //Import from db.js
const { parse } = require("dotenv");
console.log(" free gift card route");

const schedule = require("node-schedule");

// Schedule task to give prizes top clans on first day of every month (at 12:00AM)
schedule.scheduleJob("0 0 1 * *", function () {
  //query to choose first,second,third from the clans
  const SQLSTATEMENT = `
        select a.clanID,a.ranking from 
        (SELECT clanID, clan_point, DENSE_RANK() 
        OVER (ORDER BY clan_point DESC) AS ranking FROM clan_point 
        ORDER BY clan_point DESC) a
        where a.ranking in (1,2,3);
            `;

  connection
    .promise()
    .query(SQLSTATEMENT)
    .then(([rows, fields]) => {
      let jsonData = [];
      for (let i = 0; i < rows.length; i++) {
        jsonData.push({
          clan_ID: rows[i].clanID,
          rank: parseInt(rows[i].ranking),
        });
      }
      console.log(jsonData);

      for (const data of jsonData) {
        //query to put top clans information into current_month_rank table 'temporarily'
        // the after they have been chosen (*players can still play the mini-game
        //afer 12::00am so the points may change)
        const sqlQuery = `
                     insert into current_month_rank
                        (clan_ID,clan_rank,date_updated)
                        values('${data.clan_ID}',${data.rank},current_timestamp());
                    `;
        const VALUES = [data.clanName, data.rank];
        connection
          .promise()
          .query(sqlQuery, VALUES)
          .then(([rows, fields]) => {
            console.log(rows);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

//schedule task
//the expired date of free gift card
schedule.scheduleJob("0 0 7 * *", function () {
  //query to delete all from current_month_rank table which are kept temporarily
  const SQLSTATEMENT = `
    delete from current_month_rank;
        `;

  connection
    .promise()
    .query(SQLSTATEMENT)
    .then(([rows, fields]) => {
      console.log("deleted successfully");
    })
    .catch((error) => {
      console.log(error);
    });
});

//get url link of prize photos
router.get("/urlForFreeCard", (req, res, next) => {
  const SQLSTATEMENT = `
    select * from freeGiftCard;
         
    `;
  connection
    .promise()
    .query(SQLSTATEMENT)
    .then(([rows, fields]) => {
      let jsonData = [];
      for (let i = 0; i < rows.length; i++) {
        jsonData.push({
          freeCard_ID: rows[i].freeCard_ID,
          cardPhotoUrl: rows[i].cardPhotoUrl,
          freeCard_Name: rows[i].freeCard_Name,
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

//get clan names to get prizes
router.get("/getAllDataFromCurrentMonthRank", (req, res, next) => {
  const SQLSTATEMENT = `
    select clan_ID , clan_rank 
    from current_month_rank;
         
    `;
  connection
    .promise()
    .query(SQLSTATEMENT)
    .then(([rows, fields]) => {
      let jsonData = [];
      for (let i = 0; i < rows.length; i++) {
        jsonData.push({
          clan_ID: rows[i].clan_ID,
          clan_rank: rows[i].clan_rank,
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

//insert new rows in the freeGiftCard_History after clan takes prizes
router.post("/updatePrizesHistory", (req, res, next) => {
  let clanID = req.body.clanID;
  let parse_clanID = parseInt(clanID);
  //get clan points first because point also need to be stored in freeGiftCard_History
  const SQLSTATEMENT = `
    select clan_point from clan_point
    where clanID =${parse_clanID};    
    `;

  const VALUES = [parse_clanID];

  connection
    .promise()
    .query(SQLSTATEMENT, VALUES)
    .then(([rows, fields]) => {
      console.log(rows);

      let clan_point = parseInt(rows[0].clan_point);

      let freeCard_ID = req.body.freeCard_ID;
      let parse_freeCard_ID = parseInt(freeCard_ID);

      const SQLSTATEMENT = `
            insert into freeGiftCard_History
            values(${parse_freeCard_ID},${parse_clanID},${clan_point},current_timestamp());   
            `;
      const VALUES = [parse_freeCard_ID, parse_clanID, clan_point];

      connection
        .promise()
        .query(SQLSTATEMENT, VALUES)
        .then(([rows, fields]) => {
          console.log("successful");
          //delete from current_month_rank after claiming prize
          //because one clan can claim only one time every month
          const SQLSTATEMENT = `
                delete from current_month_rank where clan_ID = ${parse_clanID};   
                `;
          const VALUES = [parse_clanID];

          connection
            .promise()
            .query(SQLSTATEMENT, VALUES)
            .then(([rows, fields]) => {
              console.log("successful");
              res.send("successful");
            })
            .catch((error) => {
              console.log(error);
              res.send(error);
            });
        })
        .catch((error) => {
          console.log(error);
          res.send(error);
        });
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});

//after the clan has claimed, it got new prize but its clan points will be reset to zero
router.delete("/setUpClanPointsZero/:clanID", (req, res, next) => {
  let clanID = req.params.clanID;
  //let clanID = req.body.clanID;
  let parse_clanID = parseInt(clanID);
  //delete all history from mini_game history first
  const SQLSTATEMENT = `
  delete from mini_game
  where clanID=${parse_clanID};
    `;

  const VALUES = [parse_clanID];

  connection
    .promise()
    .query(SQLSTATEMENT, VALUES)
    .then(([rows, fields]) => {
      console.log("successful");
      //query to reset clan point to zero
      const SQLSTATEMENT = `
        update clan_point 
        set clan_point =0, points_added=0
        where ClanID = ${parse_clanID};     
          `;
      const VALUES = [parse_clanID];
      connection
        .promise()
        .query(SQLSTATEMENT, VALUES)
        .then(([rows, fields]) => {
          res
            .status(200)
            .send(`set to 0 for clanPoints of clan ${parse_clanID}`);
          res.end();
        })
        .catch((error) => {
          console.log(error);
          res.send(error);
        });
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});

//get number of cards clan got from freeGiftCard_History
router.get("/numberOfCards/:clanID", (req, res, next) => {
  //get Clan Point
  let clanID = req.params.clanID;
  let parse_clanID = parseInt(clanID);

  const SQLSTATEMENT = `
      select fc.freeCard_Name, a.no_of_cards , a.clan_ID from 
      (select freeCard_ID,count(*) as no_of_cards, clan_ID
      from freeGiftCard_History
      where clan_ID = ${parse_clanID}
      group by freeCard_ID,clan_ID) a, freeGiftCard fc
      where a.freeCard_ID = fc.freeCArd_ID;  
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
          freeCard_Name: rows[i].freeCard_Name,
          no_of_cards: rows[i].no_of_cards,
        });
      }
      //  console.log(jsonData[0].no_of_cards);
      res.status(200).send(jsonData);
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});

router.post("/updatePrizesAfterspinningWheel", (req, res, next) => {
  let giftCardID = req.body.giftCardID;
  parse_giftCardID = parseInt(giftCardID);
  let clanID = req.body.clanID;
  parse_clanID = parseInt(clanID);
  let clanPoints = req.body.clanPoints;
  parse_clanPoints = parseInt(clanPoints);
  
  const SQLSTATEMENT = `
  insert into freeGiftCard_History 
  (freeCard_ID,clan_ID,clan_point,date_updated)
  values (${parse_giftCardID},${parse_clanID},${parse_clanPoints},current_timestamp());
    `;
  const VALUES = [parse_giftCardID,parse_clanID,parse_clanPoints];

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

router.get("/luckywheelStatisticsDetails/:clanID", (req, res, next) => {
  let clanID = req.params.clanID;
  parse_clanID = parseInt(clanID);

  const SQLSTATEMENT = `
  SELECT player.player_username,
  b.totalTimes,
  b.totalPoints,
  b.totalFirstPrize,
  b.totalSecondPrize,
  b.totalThirdPrize
FROM player,
(
SELECT a.player_ID,
      COALESCE(SUM(luckywheel_history.points_increased), 0) as totalPoints,
      COALESCE(SUM(luckywheel_history.firstPrize), 0) as totalFirstPrize,
      COALESCE(SUM(luckywheel_history.secondPrize), 0) as totalSecondPrize,
      COALESCE(SUM(luckywheel_history.thirdPrize), 0) as totalThirdPrize,
      COALESCE(SUM(luckywheel_history.timeOfSpinning), 0) as totalTimes
FROM (SELECT player_ID FROM clanmates WHERE clanID = ${parse_clanID}) a
LEFT JOIN luckywheel_history ON a.player_ID = luckywheel_history.player_ID
GROUP BY a.player_ID
) b
WHERE player.player_ID = b.player_ID;
         
    `;
  const VALUES = [parse_clanID];

  connection
    .promise()
    .query(SQLSTATEMENT, VALUES)
    .then(([rows, fields]) => {
      let jsonData = [];
      for (let i = 0; i < rows.length; i++) {
        jsonData.push({
          playerName: rows[i].player_username,
          times: rows[i].totalTimes,
          totalPoints: rows[i].totalPoints,
          totalFirstPrize : rows[i].totalFirstPrize,
          totalSecondPrize:rows[i].totalSecondPrize,
          totalThirdPrize:rows[i].totalThirdPrize
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

router.post("/updateluckywheelStatistics", (req, res, next) => {
  let playerID = req.body.playerID;
  parse_playerID = parseInt(playerID);

  let clanID = req.body.clanID;
  parse_clanID = parseInt(clanID);

  let pointsIncreased = req.body.pointsIncreased;
  parse_pointsIncreased = parseInt(pointsIncreased);

  let firstPrize = req.body.firstPrize;
  parse_firstPrize = parseInt(firstPrize);

  let secondPrize = req.body.secondPrize;
  parse_secondPrize = parseInt(secondPrize);

  let thirdPrize = req.body.thirdPrize;
  parse_thirdPrize = parseInt(thirdPrize);
  

  
  const SQLSTATEMENT = `
  INSERT INTO luckywheel_history
    (player_id, clan_id, points_increased, firstPrize, secondPrize, thirdPrize, timeOfSpinning)
VALUES
    (${parse_playerID} , ${parse_clanID}, ${parse_pointsIncreased}, ${parse_firstPrize}, ${parse_secondPrize},${parse_thirdPrize}, 1);

    `;
  const VALUES = [parse_playerID,parse_clanID,parse_pointsIncreased,parse_firstPrize,parse_secondPrize,parse_thirdPrize];

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

module.exports = router;
