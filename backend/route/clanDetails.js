const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const router = express.Router();
router.use(bodyParser.json());
router.use(urlencodedParser);
router.use(cors());
const connection = require('../db'); //Import from db.js

//get all existing clans
router.get('/getExistingClans', async (req, res, next) => {
    const sql = `SELECT * FROM clan c join clanDetails cd on c.ClanID=cd.ClanID `
    connection.promise().query(sql)
        .then((result) => {
            console.log(result[0])
            res.send(result[0]);
            return;
        })
        .catch((error) => {
            console.log("catch");
            res.send(error);
            return;
        });
})

//get ClanID by ClanName
router.post('/getClanID/:ClanName', async (req, res, next) => {
    const clanName = req.params.ClanName
    const sql = `SELECT ClanID FROM clan WHERE ClanName=?`
    connection.promise().query(sql, clanName)
        .then((result) => {
            console.log(result[0][0].ClanID)
            res.send(result[0][0]);
            return;
        })
        .catch((error) => {
            console.log("catch");
            res.send(error);
            return;
        });
});

//get all clans from player_id
router.post('/getAllClans/:player_id', async (req, res, next) => {
    const player_id = parseInt(req.params.player_id);

    if (isNaN(player_id)) {
        res.status(400).send("player_id is not a number");
        return;
    }
    else if (player_id <= 0) {
        res.status(400).send("Invalid Range");
        return;
    }



    const sql = `select clan.*, clanDetails.ClanType, clanDetails.LimitCheck, clan_point.clan_point, clanmates.PlayerRole from clanmates inner join clan on clanmates.ClanID=clan.ClanID inner join clan_point on clanmates.ClanID=clan_point.ClanID inner join clanDetails on clanmates.ClanID=clanDetails.ClanID where clanmates.player_id=? order by clan.ClanName asc`;
    const values = player_id;
    connection.promise().query(sql, values)
        .then((result) => {
            var arrayData = []
            for (let x = 0; x < result[0].length; x++) {
                arrayData.push(result[0][x]);
            }
            console.log(result[0]);
            res.send(arrayData)
        })
        .catch((error) => {
            console.log("catch");
            console.log(error)
            res.send(error)
            return;
        });


});

//check if player_id is from clan
router.get(`/checkPlayerFromClan/:ClanID/:player_id`, async (req, res, next) => {
    const ClanID = parseInt(req.params.ClanID);
    const player_id = parseInt(req.params.player_id);
    const values = [ClanID, player_id];
    const sql = `SELECT * FROM clanmates where ClanID=? and player_id=? `
    connection.promise().query(sql, values)
        .then((result) => {
            console.log(result[0])
            res.send(result[0]);
            return;
        })
        .catch((error) => {
            console.log("catch");
            res.send(error);
            return;
        });
})

//create clan
router.post('/createClan/:CreatedBy', async (req, res, next) => {
    var ClanID;
    const CreatedBy = parseInt(req.params.CreatedBy);
    const ClanName = req.body.ClanName;
    const ClanType = req.body.ClanType;
    if (ClanName == null || ClanType == null) {
        res.status(400).send('incomplete data');
        return;
    }
    const clan_point = 0;
    const PlayerRole = 'leader';
    const values = [ClanName, CreatedBy];
    const sql = `Insert into clan (ClanName,CreatedBy) values(?,?)`;
    connection.promise().query(sql, values)
        .then((result) => {
            console.log(result)
            ClanID = result[0].insertId;
            const values2 = [result[0].insertId, ClanType]
            const sql2 = `Insert into clanDetails (ClanID,ClanType) values(?,?)`
            connection.promise().query(sql2, values2)
                .then((result2) => {
                    console.log(result2);
                    const values3 = [ClanID, clan_point]
                    const sql3 = `Insert into clan_point (ClanID,clan_point) values(?,?)`
                    connection.promise().query(sql3, values3)
                        .then((result3) => {
                            console.log(result3);
                            const value4 = [ClanID, CreatedBy, PlayerRole]
                            const sql4 = `Insert into clanmates (ClanID,player_id, PlayerRole) values(?,?,?)`
                            connection.promise().query(sql4, value4)
                                .then((result4) => {
                                    console.log(result4);
                                    let jsonData = {
                                        "insertId": result[0].insertId
                                    }
                                    res.send(jsonData);
                                })
                                .catch((error) => {
                                    console.log(error);
                                    res.send(error);
                                    return
                                })

                        })
                        .catch((error) => {
                            console.log(error)
                            res.send(error)
                            return;
                        })

                })
                .catch((error) => {
                    console.log("catch");
                    console.log(error)
                    res.send(error)
                    return;
                })
        })
        .catch((error) => {
            console.log("catch");
            console.log(error)
            res.send(error)
            return;
        });


});

//get clans created by player_id
router.get('/clanCreatedBy/:player_id', async (req, res, next) => {
    const player_id = parseInt(req.params.player_id);
    const sql = `select c.*, cd.ClanType, cp.clan_point from clan c, clanDetails cd, clan_point cp where c.CreatedBy =? and c.ClanID=cd.ClanID and c.ClanID=cp.ClanID`;
    connection.promise().query(sql, player_id)
        .then((result) => {

            res.send(result[0])
        })
        .catch((error) => {
            console.log("catch");
            console.log(error)
            res.send(error)
            return;
        });


});

//unjoin clan
router.delete('/unjoinClan/:ClanID/:player_id', async (req, res, next) => {
    const ClanID = parseInt(req.params.ClanID);
    const player_id = parseInt(req.params.player_id);
    const values = [ClanID, player_id];
    const sql = `Delete from clanmates where ClanID=? and player_id=?`;
    connection.promise().query(sql, values)
        .then((result) => {
            console.log(result)
            res.send(result)
            return;
        })
        .catch((error) => {
            console.log("error");
            console.log(error)
            res.send(error)
            return;
        });


});

//update clan points
router.put("/updateClanPoints/:ClanID", async (req, res, next) => {
    const ClanID = parseInt(req.params.ClanID);
    const clan_point = parseInt(req.body.clan_point);
    const data = [clan_point, ClanID]
    const sql = `UPDATE clan_point SET clan_point=clan_point+? where ClanID=?`;
    connection.promise().query(sql, data)
        .then((result) => {
            console.log(result);
            res.send('update clan points succesful');
            return;
        })
        .catch((error) => {
            console.log(error);
            res.send(error);
            return;
        });

})

//delete clan created by player_id
router.delete('/deleteClan/:ClanID', (req, res, next) => {
    const ClanID = parseInt(req.params.ClanID);

    connection.promise()
        .query('DELETE FROM clan WHERE ClanID = ?', ClanID)
        .then(() => connection.promise().query('DELETE FROM clan_point WHERE ClanID = ?', ClanID))
        .then(() => connection.promise().query('DELETE FROM clanDetails WHERE ClanID = ?', ClanID))
        .then(() => connection.promise().query('DELETE FROM clanmates WHERE ClanID = ?', ClanID))
        .then(() => connection.promise().query('DELETE FROM DiscoCosmo WHERE ClanID = ?', ClanID))
        .then(() => connection.promise().query('DELETE FROM TheHive WHERE ClanID = ?', ClanID))
        .then(() => connection.promise().query('DELETE FROM RPSstatistic WHERE ClanID = ?', ClanID))
        .then(() => connection.promise().query('DELETE FROM mini_game WHERE ClanID = ?', ClanID))
        .then(() => {
            res.send(`Clan with ClanID=${ClanID} deleted`);
        })
        .catch((error) => {
            console.log(error);
            res.send(error);
        });
});


//getAllMembers
router.get('/getAllMembers/:clan_Name', async (req, res, next) => {
    const ClanName = req.params.clan_Name;

    const sql = `select c.*, p.player_username,p.player_id, i.image_path from clan join clanmates c on clan.ClanID=c.ClanID join player p on c.player_id=p.player_id join player_avatar i on p.image_id = i.image_id where clan.ClanName=? order by c.PlayerRole = 'leader' desc, c.PlayerRole='coleader' desc,p.player_username; `;
    connection.promise().query(sql, ClanName)
        .then((result) => {
            var arrayData = []
            for (let x = 0; x < result[0].length; x++) {
                arrayData.push(result[0][x]);
            }
            console.log(result[0]);
            res.send(arrayData)
        })
        .catch((error) => {
            console.log("catch");
            console.log(error)
            res.send(error)
            return;
        });


});

//no of members in a clan
router.get('/noOfMembers/:ClanID', async (req, res, next) => {
    const ClanID = parseInt(req.params.ClanID);
    const sql = `select count(player_id) no_of_members from clanmates where ClanID=?`
    connection.promise().query(sql, ClanID)
        .then((result) => {
            console.log(result[0])
            res.send(result[0])
        })
        .catch((error) => {
            console.log("catch");
            console.log(error)
            res.send(error)
            return;
        });


});

//get all public clans
router.get('/getAllPublicClans/:player_id', async (req, res, next) => {
    const player_id = req.params.player_id;
    const sql = `select c.*, cd.ClanType from clan c join clanDetails cd on c.ClanID=cd.ClanID where cd.ClanType='public' and c.ClanID NOT IN (select ClanID from clanmates where player_id=?)`
    connection.promise().query(sql, player_id)
        .then((result) => {
            console.log(result[0])
            res.send(result[0])
        })
        .catch((error) => {
            console.log("catch");
            console.log(error)
            res.send(error)
            return;
        });


});

//totalclan points earned
router.get('/totalClanPoints/:player_id', async (req, res, next) => {
    var mgPoints;
    var rpsPoints;
    const player_id = req.params.player_id;
    const values = [
        player_id, player_id
    ]
    const sql = `select sum(points_received) mgPoints,(select sum(clan_point_earned) from RPSstatistic where player_id=?) rpsPoints from mini_game where player_ID=?
    
    `
    connection.promise().query(sql, values)
        .then((result) => {

            mgPoints = result[0][0].mgPoints;
            rpsPoints = result[0][0].rpsPoints;

            if (mgPoints == null) {
                mgPoints = 0
            }
            if (rpsPoints == null) {
                rpsPoints = 0
            }

            let jsonData = {
                "total_points": parseInt(mgPoints) + parseInt(rpsPoints)
            }


            res.type('json').send(jsonData)
        })
        .catch((error) => {
            console.log("catch");
            console.log(error)
            res.send(error)
            return;
        });


});

//get all existing clans
router.get('/getClanDetails/:clan_id', async (req, res, next) => {
    const sql = `SELECT * FROM clan c join clanDetails cd on c.ClanID=cd.ClanID join clan_point cp on cd.ClanID=cp.ClanID where c.ClanID=? `
    connection.promise().query(sql, parseInt(req.params.clan_id))
        .then((result) => {
            console.log(result[0])
            res.send(result[0]);
            return;
        })
        .catch((error) => {
            res.send(error);
            return;
        });
})

//contribution of clan points earned
router.post('/getClanPointsContribution/:clan_id', async (req, res, next) => {
    var clan_id = parseInt(req.params.clan_id);
    var dateNow = new Date();
    var nowMonth = dateNow.getMonth() + 1;
    var nowYear = dateNow.getFullYear();
    var nowDate = dateNow.getDate();
    var todayDay = dateNow.getDay();
    var data = [clan_id, clan_id, clan_id];
    var month = req.body.month;
    var year = req.body.year;
    var date = req.body.date;
    var extraSql = '';
    var extraSql2 = '';
    var addArr = [7, 6, 5, 4, 3, 2, 1]


    if (year != null) {
        extraSql = 'and year(timestamp)=?';
        extraSql2 = 'and year(dateAndTime)=?';
        data = [clan_id, nowYear, clan_id, nowYear, clan_id]
    }


    if (date != null) {
        //date of the last date of the week
        var lastDate = new Date(
            dateNow.getFullYear(),
            dateNow.getMonth(),
            dateNow.getDate() - 7,
        )

        extraSql = 'and  date(timestamp) between ? and ?';
        extraSql2 = 'and date(dateAndTime) between ? and ?';
        data = [clan_id, lastDate, dateNow, clan_id, lastDate, dateNow, clan_id]
    }

    if (month != null) {
        if ("last3Months") {
            //var min=req.body.month;
            var min = new Date(dateNow.getFullYear(), dateNow.getMonth() - 1);
            var max = new Date(dateNow.getFullYear(), dateNow.getMonth() + 1)
            extraSql = 'and  date(timestamp) between ? and ?';
            extraSql2 = 'and  date(dateAndTime) between ? and ?'
            data = [clan_id, min, max, clan_id, min, max, clan_id]
        }
        else if ("last6Months") {
            var min = new Date(dateNow.getFullYear(), dateNow.getMonth() - 4);
            var max = new Date(dateNow.getFullYear(), dateNow.getMonth() + 1)
            extraSql = 'and  date(timestamp) between ? and ?';
            extraSql2 = 'and  date(dateAndTime) between ? and ?'
            data = [clan_id, min, max, clan_id, min, max, clan_id]
        }
    }

    const sql = `SELECT
    player_id,
    player_username,
    image_path,
    ifNull(mgPoints,0) mgPoints,
    ifNull(rpsPoints,0) rpsPoints,
    ( ifNull(mgPoints,0) +  ifNull(rpsPoints,0)) AS clan_points_earned
FROM
    (
        SELECT
        p.player_username,
        i.image_path,
            c.player_id,
            c.playerRole,
            (SELECT SUM(ifNUll(points_received,0)) FROM mini_game WHERE player_ID = c.player_id and clanID=? ${extraSql2}) AS mgPoints,
            (SELECT SUM(ifNULL(clan_point_earned,0)) FROM RPSstatistic WHERE player_id = c.player_id AND ClanID = ? ${extraSql}) AS rpsPoints
        FROM
            clanmates c
        LEFT JOIN RPSstatistic rps ON c.ClanID = rps.ClanID AND c.player_id = rps.player_id
        LEFT JOIN mini_game m ON c.ClanID = m.clanID AND c.player_id = m.player_ID
        JOIN player p ON c.player_id=p.player_id
        JOIN player_avatar i ON p.image_id=i.image_id 
        WHERE
            c.ClanID = ?
        GROUP BY
            c.player_id, c.playerRole
         
    ) AS subquery
ORDER BY
 PlayerRole = 'leader' desc, PlayerRole='coleader' desc,player_username; 


`
    connection.promise().query(sql, data)
        .then((result) => {
            // console.log(result[0])
            res.send(result[0]);
            return;
        })
        .catch((error) => {
            console.log(error);
            res.send(error);
            return;
        });
})

//total clan points in clanid
router.get('/getTotalClanPointsFromGame/:clan_id', async (req, res, next) => {

    var clan_id = parseInt(req.params.clan_id);
    const sql = `
    SELECT rps.ClanID,  (SELECT ifNull(sum(rps.clan_point_earned),0) from RPSstatistic rps  where rps.ClanID=? group by rps.ClanID) rpsPoints, (SELECT ifNull(sum(mg.points_received),0) mgPoints from mini_game mg  where mg.clanID=? group by mg.clanID) mgPoints from RPSstatistic rps join mini_game mg on rps.ClanID = mg.clanID where rps.ClanID=? group by rps.ClanID

    `
    connection.promise().query(sql, [clan_id, clan_id, clan_id])
        .then((result) => {
            var points = 0
            if (result[0].length == 0) {
                points = 0
            }
            else {
                points = parseInt(result[0][0].rpsPoints) + parseInt(result[0][0].mgPoints)
            }
            res.send({ "points": points });
            return;
        })
        .catch((error) => {
            console.log(error);
            res.send(error);
            return;
        });
})

//avg clan points from games by clan id
router.get('/getAvgClanPointsFromGame/:clan_id', async (req, res, next) => {

    var clan_id = parseInt(req.params.clan_id);
    const sql = `
    SELECT rps.ClanID, (SELECT count(c.player_id) from clanmates c where c.ClanID=? group by c.ClanID ) countMembers, (SELECT ifNull(sum(rps.clan_point_earned),0) from RPSstatistic rps  where rps.ClanID=?
group by rps.ClanID) rpsPoints, (SELECT ifNull(sum(mg.points_received),0) mgPoints from mini_game mg  where mg.clanID=? group by mg.clanID) mgPoints from RPSstatistic rps join mini_game mg on rps.ClanID = mg.clanID join clanmates c on c.ClanID=rps.ClanID where rps.ClanID=? group by rps.ClanID

    `
    connection.promise().query(sql, [clan_id, clan_id, clan_id, clan_id])
        .then((result) => {
            var points = 0
            if (result[0].length > 0) {
                var points = parseInt(result[0][0].rpsPoints) + parseInt(result[0][0].mgPoints)
                var avgPoints = points / parseInt(result[0][0].countMembers)
            }
            res.send({ "avgPoints": avgPoints });
            return;
        })
        .catch((error) => {
            console.log(error);
            res.send(error);
            return;
        });
})

//total clan points spent on furniture by each member
router.post('/clanPointsSpent/:clan_id', async (req, res, next) => {
    var clan_id = parseInt(req.params.clan_id);
    var dateNow = new Date();
    var nowMonth = dateNow.getMonth() + 1;
    var nowYear = dateNow.getFullYear();
    var nowDate = dateNow.getDate();
    var todayDay = dateNow.getDay();
    var data = [clan_id];
    var month = req.body.month;
    var year = req.body.year;
    var date = req.body.date;
    var extraSql = '';
    var addArr = [7, 6, 5, 4, 3, 2, 1]

    if (year != null) {
        extraSql = 'and year(hf.date_bought)=?';
        data = [nowYear, clan_id]
    }


    if (date != null) {
        var lastDate = new Date(
            dateNow.getFullYear(),
            dateNow.getMonth(),
            dateNow.getDate() - 7,
        )
        extraSql = 'and date(hf.date_bought) between ? and ?';
        data = [lastDate, dateNow, clan_id]
    }

    if (month != null) {
        if ("last3Months") {
            var min = new Date(dateNow.getFullYear(), dateNow.getMonth() - 1);
            var max = new Date(dateNow.getFullYear(), dateNow.getMonth() + 1)
            extraSql = 'and  date(hf.date_bought) between ? and ?';
            data = [min, max, clan_id]
        }
        else if ("last6Months") {
            var min = new Date(dateNow.getFullYear(), dateNow.getMonth() - 4);
            var max = new Date(dateNow.getFullYear(), dateNow.getMonth() + 1)
            extraSql = 'and  date(hf.date_bought) between ? and ?';
            data = [min, max, clan_id]
        }
    }
    const sql = `
    SELECT
    p.player_id,
        p.player_username,
        i.image_path,
        IFNULL(SUM(hs.clan_points), 0) AS clan_points_spent
    FROM
        clanmates c
    LEFT JOIN hiveFurniture hf ON c.player_id = hf.buyer_id AND c.ClanID = hf.clan_id ${extraSql}
    LEFT JOIN hiveShop hs ON hs.furniture_id = hf.furniture_id
    JOIN player p ON c.player_id = p.player_id
    JOIN player_avatar i ON p.image_id = i.image_id
    WHERE
        c.ClanID = ? 
    GROUP BY
      p.player_id,c.PlayerRole
      ORDER BY 
      c.PlayerRole = 'leader' desc, c.PlayerRole='coleader' desc,p.player_username
      asc
    
    `
    connection.promise().query(sql, data)
        .then((result) => {
            console.log(result[0])
            res.send(result[0])
            return;
        })
        .catch((error) => {
            console.log(error);
            res.send(error);
            return;
        });
})

//clanPointsByDate
router.post('/getClanPointsByDate/:clan_id', async (req, res, next) => {
    try {
        var clan_id = parseInt(req.params.clan_id);
        var dateNow = new Date();
        var nowMonth = dateNow.getMonth() + 1;
        var nowYear = dateNow.getFullYear();
        var nowDate = dateNow.getDate();
        var todayDay = dateNow.getDay();
        var data = [clan_id, nowMonth, clan_id, nowMonth];
        var month = req.body.thisMonth;
        var week = req.body.thisweek;
        var last3week = req.body.last3week;
        var last3Months = req.body.last3Months;
        var extraSql = '';
        var extraSql2 = '';

        var playersDate = [];
        const monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "Septemeber", "October", "November", "December"]
        if (last3week != null) {
            var lastDate = new Date(
                dateNow.getFullYear(),
                dateNow.getMonth(),
                dateNow.getDate() - 21
            )
            extraSql = 'and  date(rps.timestamp) between ? and ?';
            extraSql2 = 'and date(mg.dateAndTime) between ? and ?';
            data = [clan_id, lastDate, dateNow, clan_id, lastDate, dateNow]
        }


        if (week != null) {
            var lastDate = new Date(
                dateNow.getFullYear(),
                dateNow.getMonth(),
                dateNow.getDate() - 7
            )
            extraSql = 'and  date(rps.timestamp) between ? and ?';
            extraSql2 = 'and date(mg.dateAndTime) between ? and ?';
            data = [clan_id, lastDate, dateNow, clan_id, lastDate, dateNow]
        }

        if (month != null) {

            extraSql = 'and month(rps.timestamp)=?';
            extraSql2 = 'and month(mg.dateAndTime)=?';
            data = [clan_id, nowMonth, clan_id, nowMonth]
        }

        if (last3Months != null) {
            var min = new Date(dateNow.getFullYear(), dateNow.getMonth() - 1);
            var max = new Date(dateNow.getFullYear(), dateNow.getMonth() + 1);
            extraSql = 'and  date(rps.timestamp) between ? and ?';
            extraSql2 = 'and date(mg.dateAndTime) between ? and ?';
            data = [clan_id, min, max, clan_id, min, max]
        }

        const sql = `
    SELECT
    date,
    ClanID,
    SUM(rpsPoints) AS rpsPoints,
    SUM(mgPoints) AS mgPoints
FROM
    (
        SELECT
        rps.ClanID,
            DATE(rps.timestamp) AS date,
            SUM(rps.clan_point_earned) AS rpsPoints,
            0 AS mgPoints
        FROM
            RPSstatistic rps
        WHERE
            rps.ClanID = ? ${extraSql}
        GROUP BY
            DATE(rps.timestamp), rps.ClanID

        UNION ALL

        SELECT
        mg.ClanID,
            DATE(mg.dateAndTime) AS date,
            0 AS rpsPoints,
            SUM(mg.points_received) AS mgPoints
        FROM
            mini_game mg
        WHERE
            mg.ClanID = ? ${extraSql2}
        GROUP BY
            DATE(mg.dateAndTime), mg.ClanID
    ) AS subquery
GROUP BY
    date, ClanID
order by date asc
    
    `
        const getPlayersPlayed = `
        SELECT DISTINCT x.player_username, ifNull(y.rpsPoints,0)+ifNull(z.mgPoints,0) totalPoints
        FROM (
            SELECT p.player_username
            FROM RPSstatistic rps join player p on p.player_id=rps.player_id
            WHERE DATE(rps.timestamp) = ? AND rps.ClanID = ?
            UNION
            SELECT p.player_username
            FROM mini_game mg join player p on p.player_id=mg.player_ID
            WHERE DATE(mg.dateAndTime) = ? AND mg.clanID = ?
        ) x left join (  SELECT sum(rps.clan_point_earned) rpsPoints , p.player_username from RPSstatistic rps 
         join player p on p.player_id=rps.player_id   WHERE DATE(rps.timestamp) = ? AND rps.ClanID = ? group by rps.player_id) y
        on x.player_username=y.player_username  left join (  SELECT sum(mg.points_received) mgPoints , p.player_username from mini_game mg 
        join player p on p.player_id=mg.player_id   WHERE DATE(mg.dateAndTime) = ? AND mg.clanID = ? group by mg.player_ID) z
        on x.player_username=z.player_username          

    `
        const [result] = await connection.promise().query(sql, data);
        // Using async/await to fetch playersDate array
        var playersDate = await Promise.all(result.map(async (data) => {
            var result_date = new Date(data.date);
            var playersData = [];
            var pointsEarnedEach = [];
            var playersPlayedDate = [result_date, clan_id, result_date, clan_id, result_date, clan_id, result_date, clan_id];
            const playersUsername = await connection.promise().query(getPlayersPlayed, playersPlayedDate);
            playersUsername[0].forEach((data) => {
                playersData.push(data.player_username);
                pointsEarnedEach.push(data.totalPoints);
            });
            var arr = []
            arr.push({
                "playersDate": playersData,
                "pointsEarnedEach": pointsEarnedEach
            })
            return arr;
        }));

        var date = [];
        var pointsEarned = [];

        result.forEach((data) => {
            var result_date = new Date(data.date);
            var formattedDate = result_date.getDate().toString().padStart(2, 0) + '-' + monthArr[result_date.getMonth()] + '-' + result_date.getFullYear();
            var total_points = parseInt(data.rpsPoints) + parseInt(data.mgPoints);
            date.push(formattedDate);
            pointsEarned.push(total_points);
        });

        var jsonData = {
            "Date": date,
            "points_earned": pointsEarned,
            "playersDate": playersDate
        };

        console.log(result[0]);
        console.log(jsonData);
        res.send(jsonData);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

//Top Contribution of clan points earned
router.get('/topContribution/:clan_id', async (req, res, next) => {
    try {
        const clan_id = parseInt(req.params.clan_id);
        const data = [clan_id, clan_id, clan_id];

        const getPlayerContribution = () => {
            const sql = `SELECT
                player_id,
                player_username,
                image_path,
                IFNULL(mgPoints, 0) AS mgPoints,
                IFNULL(rpsPoints, 0) AS rpsPoints,
                (IFNULL(mgPoints, 0) + IFNULL(rpsPoints, 0)) AS clan_points_earned
            FROM
                (
                    SELECT
                        p.player_username,
                        i.image_path,
                        c.player_id,
                        (
                            SELECT SUM(IFNULL(points_received, 0))
                            FROM mini_game
                            WHERE player_ID = c.player_id AND clanID = ?
                        ) AS mgPoints,
                        (
                            SELECT SUM(IFNULL(clan_point_earned, 0))
                            FROM RPSstatistic
                            WHERE player_id = c.player_id AND ClanID = ?
                        ) AS rpsPoints
                    FROM
                        clanmates AS c
                    LEFT JOIN RPSstatistic AS rps ON c.ClanID = rps.ClanID AND c.player_id = rps.player_id
                    LEFT JOIN mini_game AS m ON c.ClanID = m.clanID AND c.player_id = m.player_ID
                    JOIN player AS p ON c.player_id = p.player_id
                    JOIN player_avatar AS i ON p.image_id = i.image_id
                    WHERE
                        c.ClanID = ?
                    GROUP BY
                        c.player_id
                ) AS subquery
            ORDER BY
                clan_points_earned DESC
            LIMIT 1;`;

            return connection.promise().query(sql, data);
        };

        const topPlayerSpent = () => {
            const sql2 = `  SELECT
            p.player_id,
                p.player_username,
                i.image_path,
                IFNULL(SUM(hs.clan_points), 0) AS clan_points_spent
            FROM
                clanmates c
            LEFT JOIN hiveFurniture hf ON c.player_id = hf.buyer_id AND c.ClanID = hf.clan_id 
            LEFT JOIN hiveShop hs ON hs.furniture_id = hf.furniture_id
            JOIN player p ON c.player_id = p.player_id
            JOIN player_avatar i ON p.image_id = i.image_id
            WHERE
                c.ClanID = ? 
            GROUP BY
              p.player_id,c.PlayerRole
              ORDER BY 
              clan_points_spent
              desc
              limit 1`

            return connection.promise().query(sql2, clan_id);
        };

        const [topPlayerEarnedResult, topPlayerSpentResult] = await Promise.all([
            getPlayerContribution(),
            topPlayerSpent()
        ]);

        // Combine the results if needed and send the response
        const combinedResult = {
            topPlayerEarned: topPlayerEarnedResult[0][0].player_username,
            topPlayerSpent: topPlayerSpentResult[0][0].player_username
        };
        console.log(combinedResult)
        res.send(combinedResult);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

router.get('/countPlayersRoles/:clan_id', async (req, res, next) => {
    var clan_id = req.params.clan_id;
    const sql = `select (Select count(PlayerRole) from clanmates where PlayerRole='leader' 
    and ClanID=?) noLeaders, (Select count(PlayerRole) from clanmates where 
    PlayerRole='coleader' and ClanID=? ) nocoLeaders,(Select count(PlayerRole) from clanmates
    where PlayerRole='member' and ClanID=? ) noMember from clanmates where ClanID=? group by ClanID;`
    connection.promise().query(sql, [clan_id, clan_id, clan_id, clan_id])
        .then((result) => {
            console.log(result[0])
            res.send(result[0]);
            return;
        })
        .catch((error) => {
            console.log("catch");
            res.send(error);
            return;
        });
})

router.put('/changeRole/:clan_id/:member_id', async (req, res, next) => {
    const clan_id = parseInt(req.params.clan_id);
    const role = req.body.role;
    const member_id = req.params.member_id;
    const sql = `UPDATE clanmates
    SET PlayerRole=?
    WHERE ClanID=? and player_id=?;`
    connection.promise().query(sql, [role, clan_id, member_id])
        .then((result) => {
            console.log(result[0])
            res.send(result[0]);
            return;
        })
        .catch((error) => {
            console.log(error);
            res.send(error);
            return;
        });
});

router.delete('/deleteMember/:clan_id/:member_id', async (req, res, next) => {
    const clan_id = parseInt(req.params.clan_id);
    const member_id = req.params.member_id;
    const sql = `DELETE FROM clanmates where ClanID=? and player_id=?`
    connection.promise().query(sql, [clan_id, member_id])
        .then((result) => {
            console.log(result[0])
            res.send(result[0]);
            return;
        })
        .catch((error) => {
            console.log(error);
            res.send(error);
            return;
        });
});

//Clan Points Spent By Date
router.post('/getClanSpentPointsByDate/:clan_id', async (req, res, next) => {
    try {
        var clan_id = parseInt(req.params.clan_id);
        var dateNow = new Date();
        var nowMonth = dateNow.getMonth() + 1;
        var data = [clan_id];
        var month = req.body.thisMonth;
        var week = req.body.thisweek;
        var last3week = req.body.last3week;
        var last3Months = req.body.last3Months;
        var extraSql = '';
        var extraSql2 = '';

        var playersDate = [];
        const monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "Septemeber", "October", "November", "December"]
        if (last3week != null) {
            var lastDate = new Date(
                dateNow.getFullYear(),
                dateNow.getMonth(),
                dateNow.getDate() - 21
            )
            extraSql = 'and  date(hf.date_bought) between ? and ?';
            data = [clan_id, lastDate, dateNow]
        }


        if (week != null) {
            var lastDate = new Date(
                dateNow.getFullYear(),
                dateNow.getMonth(),
                dateNow.getDate() - 7
            )
            extraSql = 'and  date(hf.date_bought) between ? and ?';
            data = [clan_id, lastDate, dateNow]
        }

        if (month != null) {

            extraSql = 'and month(hf.date_bought)=?';
            data = [clan_id, nowMonth]
        }

        if (last3Months != null) {
            var min = new Date(dateNow.getFullYear(), dateNow.getMonth() - 1);
            var max = new Date(dateNow.getFullYear(), dateNow.getMonth() + 1);
            extraSql = 'and  date(hf.date_bought) between ? and ?';
            data = [clan_id, min, max]
        }

        const sql = `  SELECT
        date(hf.date_bought) date ,
              IFNULL(SUM(hs.clan_points), 0) AS clan_points_spent
          FROM
          hiveFurniture hf 
           JOIN hiveShop hs ON hs.furniture_id = hf.furniture_id
          WHERE
              hf.Clan_id = ? ${extraSql}
          GROUP BY
           date(hf.date_bought)
         `
        const getPlayersSpent = `
        SELECT x.player_username, y.clan_point_spent
        FROM (
            SELECT DISTINCT p.player_username
            FROM hiveFurniture hf
            JOIN hiveShop hs ON hs.furniture_id = hf.furniture_id
            JOIN player p ON hf.buyer_id = p.player_id
            WHERE hf.Clan_id = ? AND DATE(hf.date_bought) = ?
        ) x
        JOIN (
            SELECT p.player_username, SUM(hs.clan_points) AS clan_point_spent
            FROM hiveFurniture hf
            JOIN hiveShop hs ON hs.furniture_id = hf.furniture_id
            JOIN player p ON hf.buyer_id = p.player_id
            WHERE hf.clan_id = ? and DATE(hf.date_bought) = ?
            GROUP BY hf.buyer_id
        ) y ON x.player_username = y.player_username;
        
    `
        const [result] = await connection.promise().query(sql, data);
        // Using async/await to fetch playersDate array
        var playersDate = await Promise.all(result.map(async (data) => {
            var result_date = new Date(data.date);
            var playersData = [];
            var pointsSpentEach = []
            var playersSpentDate = [clan_id, result_date, clan_id, result_date];
            const playersUsername = await connection.promise().query(getPlayersSpent, playersSpentDate);
            playersUsername[0].forEach((data) => {
                playersData.push(data.player_username);
                pointsSpentEach.push(data.clan_point_spent)
            });

            var arr = []
            arr.push({
                "playersDate": playersData,
                "pointsSpentEach": pointsSpentEach
            })
            return arr;
        }));

        var date = [];
        var pointsSpent = [];

        result.forEach((data) => {
            var result_date = new Date(data.date);
            var formattedDate = result_date.getDate().toString().padStart(2, 0) + '-' + monthArr[result_date.getMonth()] + '-' + result_date.getFullYear();
            var total_points = parseInt(data.clan_points_spent)
            date.push(formattedDate);
            pointsSpent.push(total_points);
        });

        var jsonData = {
            "Date": date,
            "points_spent": pointsSpent,
            "playersDate": playersDate,
        };
        console.log(playersDate)
        console.log(result[0]);
        console.log(jsonData);
        res.send(jsonData);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});






module.exports = router;