const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
let jwt = require('jsonwebtoken');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const router = express.Router();
router.use(bodyParser.json());
router.use(urlencodedParser);
router.use(cors());
const connection = require('../db'); //Import from db.js

//update rps stats table when play
router.post("/updateRPSstat/:ClanID/:player_id", async (req, res, next) => {
    const ClanID = parseInt(req.params.ClanID);
    const player_id = parseInt(req.params.player_id);
    const player_move = req.body.player_move;
    const com_move = req.body.com_move;
    const clan_point_earned = req.body.clan_point_earned;
    const gold_earned = req.body.gold_earned;
    var time_stamp = req.body.timestamp
    time_stamp = new Date(time_stamp)
    const year = time_stamp.getFullYear();
    const month = ('0' + (time_stamp.getMonth() + 1)).slice(-2);
    const day = ('0' + time_stamp.getDate()).slice(-2);
    const hours = ('0' + time_stamp.getHours()).slice(-2);
    const minutes = ('0' + time_stamp.getMinutes()).slice(-2);
    const seconds = ('0' + time_stamp.getSeconds()).slice(-2);
    time_stamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    const data = [ClanID, player_id, player_move, com_move, clan_point_earned, gold_earned, time_stamp]
    const sql = `INSERT into RPSstatistic ( ClanID, player_id, player_move,com_move,clan_point_earned,gold_earned,timestamp) values (?,?,?,?,?,?,?)`;
    connection.promise().query(sql, data)
        .then((result) => {
            res.send(result[0])
            return;
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
            return;
        });


});

//get players' gold monthly leaderboard by ClanID (done)
router.post("/getHighestGoldEarned/:ClanID", async (req, res, next) => {
    const ClanID = parseInt(req.params.ClanID);
    const month = req.body.month;
    const year = req.body.year;
    const data = [ClanID, month, year]
    const sql = `select r.player_id, i.image_path, p.player_username, sum(r.gold_earned) as total_gold_earned from RPSstatistic r join player p on r.player_id =p.player_id join player_avatar i on p.image_id=i.image_id where r.ClanID=? and month(r.timestamp)=? and year(r.timestamp)=? group by r.player_id order by total_gold_earned desc `;
    connection.promise().query(sql, data)
        .then((result) => {
            res.send(result[0])
            return;
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
            return;
        });


});

//get players' point monthly leaderboard by ClanID (done)
router.post("/getHighestPointsEarned/:ClanID", async (req, res, next) => {
    const ClanID = parseInt(req.params.ClanID);
    const month = req.body.month;
    const year = req.body.year;
    const data = [ClanID, month, year]
    const sql = `select r.player_id, i.image_path, p.player_username, sum(r.clan_point_earned) as total_points_earned from RPSstatistic r join player p on r.player_id =p.player_id join player_avatar i on p.image_id=i.image_id where r.ClanID=? and month(r.timestamp)=? and year(r.timestamp)=? group by r.player_id order by total_points_earned desc `;
    connection.promise().query(sql, data)
        .then((result) => {
            res.send(result[0])
            return;
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
            return;
        });


});

//get players' winning combi leaderboard by ClanID (done)
router.post("/getClanWinningCombiEarned/:ClanID", async (req, res, next) => {
    const ClanID = parseInt(req.params.ClanID);
    const month = req.body.month;
    const year = req.body.year;
    const data = [ClanID, month, year]
    const sql = `  SELECT player_move, com_move, SUM(gold_earned) AS total_gold_earned,  SUM(clan_point_earned) AS total_points_earned FROM RPSstatistic
    where ClanID=? and month(timestamp)=? and year(timestamp)=?
    GROUP BY player_move, com_move
    ORDER BY total_gold_earned desc;   `;
    connection.promise().query(sql, data)
        .then((result) => {
            res.send(result[0])
            return;
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
            return;
        });


});

//get public clans points monthly leaderboard  (done)
router.post("/getHighestPointsByPublicClan", async (req, res, next) => {
    const month = req.body.month;
    const year = req.body.year;
    const data = [month, year]
    const sql = `select R.ClanID, c.ClanName,sum(R.clan_point_earned) as total_points_earned  from RPSstatistic R join clanDetails cD on cD.ClanID=R.ClanID join clan c on  cD.ClanID=c.ClanID where  cD.ClanType='public' and month(R.timestamp)=? and year(R.timestamp)=? GROUP BY R.ClanID order by total_points_earned desc`;
    connection.promise().query(sql, data)
        .then((result) => {
            res.send(result[0])
            return;
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
            return;
        });


});

//get public clans monthly times played leaderboard (done)
router.post("/getTimesPlayedPublicClan", async (req, res, next) => {
    const month = req.body.month;
    const year = req.body.year;
    const data = [month, year]
    const sql = `select R.ClanID, c.ClanName,count(R.game_id) as total_times_played from RPSstatistic R join clanDetails cD on cD.ClanID=R.ClanID join clan c on  cD.ClanID=c.ClanID where  cD.ClanType='public' and month(R.timestamp)=? and year(R.timestamp)=? GROUP BY R.ClanID order by total_times_played desc  `;
    connection.promise().query(sql, data)
        .then((result) => {
            res.send(result[0])
            return;
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
            return;
        });


});

//monthly leaderboard of all players (done)
router.post("/monthlyLeaderboardOfAllPlayers", async (req, res, next) => {
    const month = req.body.month;
    const year = req.body.year;
    const data = [month, year]
    const sql = `
    select r.player_id, p.player_username ,i.image_path,sum(r.gold_earned) total_gold_earned, sum(r.clan_point_earned) total_points_earned from RPSstatistic r join player p on r.player_id=p.player_id join player_avatar i on p.image_id=i.image_id where month(r.timestamp)=? and year(r.timestamp)=? group by r.player_id order by total_gold_earned desc
    `;
    connection.promise().query(sql, data)
        .then((result) => {
            res.send(result[0])
            return;
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
            return;
        });


});

//get combi that earned the most points for ALL PLAYERS (done)
router.post("/combinationWithMostWinsAll", async (req, res, next) => {
    const month = req.body.month;
    const year = req.body.year;
    const data = [month, year]
    const sql = `
    SELECT player_move, com_move, SUM(gold_earned) AS total_gold_earned,  SUM(clan_point_earned) AS total_points_earned FROM RPSstatistic
    where month(timestamp)=? and year(timestamp)=?
    GROUP BY player_move, com_move
    ORDER BY total_gold_earned desc;    
    `;
    connection.promise().query(sql, data)
        .then((result) => {
            res.send(result[0])
            return;
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
            return;
        });


});

//get combi that the com choose (done)
router.post("/combinationComChoose", async (req, res, next) => {
    const month = req.body.month;
    const year = req.body.year;
    const data = [month, year]
    const sql = `
    SELECT
    com_move,
    COUNT(com_move) * 100 / (
      SELECT COUNT(game_id) FROM RPSstatistic WHERE
    MONTH(timestamp) = ?
    AND YEAR(timestamp) = ?
    ) AS no_of_times
  FROM
    RPSstatistic
  WHERE
    MONTH(timestamp) = ?
    AND YEAR(timestamp) = ?
  GROUP BY
    com_move
  ORDER BY
    no_of_times DESC;
  
  
    `;
    connection.promise().query(sql, data)
        .then((result) => {
            res.send(result[0])
            return;
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
            return;
        });


});

//get player past game data
router.get("/getPlayerPrevGameData/:player_id", async (req, res, next) => {
    const player_id = req.params.player_id;
    const sql = `SELECT Date(r.timestamp) as datestamp, p.player_username, i.image_path, sum(r.clan_point_earned) as total_points_earned, sum(r.gold_earned) as total_gold_earned, count(r.game_id) as no_of_times_played FROM RPSstatistic r join player p on r.player_id=p.player_id join player_avatar i on p.image_id = i.image_id  where r.player_id=? group by datestamp order by datestamp desc ;
    `;
    connection.promise().query(sql, player_id)
        .then((result) => {
            res.send(result[0])
            return;
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
            return;
        });


});

//get player past month data
router.get("/getMonthPlayerData/:player_id", async (req, res, next) => {
    const player_id = req.params.player_id;
    const sql = `select  month(timestamp) month, sum(clan_point_earned) clan_point_earned,sum(gold_earned) gold_earned, count(game_id) no_of_times from RPSstatistic where player_id=? group by month order by month asc
    `;
    connection.promise().query(sql, player_id)
        .then((result) => {
            res.send(result[0])
            return;
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
            return;
        });


});


//get combi that earned the most points/gold player 
router.get("/getCombinationWithMostWins/:player_id", async (req, res, next) => {
    const player_id = req.params.player_id;
    const sql = `
    SELECT player_move, com_move, SUM(gold_earned) AS total_gold_earned,  SUM(clan_point_earned) AS total_points_earned FROM RPSstatistic
    where player_id=?
    GROUP BY player_move, com_move
    ORDER BY total_gold_earned DESC;
    `;
    connection.promise().query(sql, player_id)
        .then((result) => {
            res.send(result[0])
            return;
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
            return;
        });


});

// avg point avg gold
router.get("/getAllSumAvg/:player_id", async (req, res, next) => {
    const player_id = req.params.player_id;
    const sql = `
    select avg(clan_point_earned) avg_clan_point , avg(gold_earned) avg_gold_earned from RPSstatistic where player_id=? ;
    `;
    connection.promise().query(sql, player_id)
        .then((result) => {
            res.send(result[0])
            return;
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
            return;
        });


});

// count how many times player wins,lose,tie
router.get("/countWins/:player_id", (req, res, next) => {
    const player_id = req.params.player_id;
    const resultArr = [];

    const queryGameLose = connection.promise().query(
        "select count(game_id) game_lose from RPSstatistic where player_id = ? and clan_point_earned = -5 and gold_earned = -3.00", player_id
    );
    const queryGameWins = connection.promise().query(
        "select count(game_id) game_wins from RPSstatistic where player_id = ? and clan_point_earned = 10 and gold_earned = 5.00", player_id
    );
    const queryGameTie = connection.promise().query(
        "select count(game_id) game_tie from RPSstatistic where player_id = ? and clan_point_earned = 0 and gold_earned = 0.00", player_id
    );

    Promise.all([queryGameLose, queryGameWins, queryGameTie])
        .then(([resultLose, resultWins, resultTie]) => {
            var gameLose = parseInt(resultLose[0][0].game_lose);
            var gameWin = parseInt(resultWins[0][0].game_wins);
            var tie = parseInt(resultTie[0][0].game_tie);
            console.log(gameLose, gameWin, tie)
            var countTotal = gameLose + gameWin + tie
            console.log(countTotal)
            if (gameLose == 0) {
                resultArr.push({
                    'result': 'lose',
                    'percentage': 0,
                });
            }
            else {
                resultArr.push({
                    'result': 'lose',
                    'percentage': (gameLose * 100) / countTotal,
                });
            }
            if (gameWin == 0) {
                resultArr.push({
                    'result': 'win',
                    'percentage': 0
                });
            }
            else {
                resultArr.push({
                    'result': 'win',
                    'percentage': (gameWin * 100) / countTotal,
                });
            }
            if (tie == 0) {
                resultArr.push({
                    'result': 'tie',
                    'percentage': 0
                });
            }
            else {
                resultArr.push({
                    'result': 'tie',
                    'percentage': (tie * 100) / countTotal,
                });
            }
            console.log(resultArr)
            res.send(resultArr);
        })
        .catch((error) => {
            console.log(error);
            res.send(error);
        });
});


//number of plays for current date
router.post("/noOfPlaysToday/:player_id", async (req, res, next) => {
    const ClanName = req.body.ClanName;
    const player_id = req.params.player_id;
    const date = req.body.date;
    const month = req.body.month;
    const year = req.body.year;
    const formattedDate = year + '-' + month + '-' + date
    const data = [player_id, ClanName, formattedDate]
    const sql = `
    select count(r.game_id) no_of_plays from RPSstatistic r join clan c on r.ClanID=c.ClanID where r.player_id=? and c.ClanName=? and date(r.timestamp)=?;
    `;
    connection.promise().query(sql, data)
        .then((result) => {
            res.send(result[0])
            return;
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
            return;
        });


});








module.exports = router;