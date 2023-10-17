const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const router = express.Router();
const connection = require('../db'); //Import from db.js

//show furniture with filter
router.get("/showAllFurnitures/:limit/:offset", async (req, res, next) => {
    var limit = parseInt(req.params.limit);
    var offset = parseInt(req.params.offset);
    if (limit == null || offset == null) {
        limit = 6;
        offset = 0
    }
    const data = [offset, limit]
    const sql = `SELECT * from hiveShop where furniture_id between ? and ? order by clan_points asc`;
    connection.promise().query(sql, data)
        .then((result) => {
            res.send(result[0]);
            return;
        })
        .catch((error) => {
            console.log(error);
            return;
        })


});

//count no of furniture
router.get("/noOfFurniture", async (req, res, next) => {
    const sql = `select count(furniture_id) no_of_furniture from hiveShop`
    connection.promise().query(sql)
        .then((result) => {
            res.send(result[0][0]);
            return;
        })
        .catch((error) => {
            console.log(error);
            return;
        })


});

//furniture owned
router.get("/furnitureOwn/:clan_id", async (req, res, next) => {

    const sql = `select * from hiveFurniture f join hiveShop s  on f.furniture_id=s.furniture_id where clan_id = ?`
    connection.promise().query(sql, parseInt(req.params.clan_id))
        .then((result) => {
            res.send(result[0]);
            return;
        })
        .catch((error) => {
            console.log(error);
            return;
        })

});

router.post("/buyFurniture/:furniture_id/:clan_id/:player_id", async (req, res, next) => {
    var furniture_id = parseInt(req.params.furniture_id);
    var clan_id = parseInt(req.params.clan_id);
    var player_id = parseInt(req.params.player_id);
    var date_bought = new Date(req.body.dateBought);
    const year2 = date_bought.getFullYear();
    const month2 = ('0' + (date_bought.getMonth() + 1)).slice(-2);
    const day2 = ('0' + date_bought.getDate()).slice(-2);
    const hours2 = ('0' + date_bought.getHours()).slice(-2);
    const minutes2 = ('0' + date_bought.getMinutes()).slice(-2);
    const seconds2 = ('0' + date_bought.getSeconds()).slice(-2);
    date_bought = `${year2}-${month2}-${day2} ${hours2}:${minutes2}:${seconds2}`;
    const sql = `insert into hiveFurniture (furniture_id,clan_id,buyer_id,date_bought) values(?,?,?,?)`
    connection.promise().query(sql, [furniture_id, clan_id, player_id, date_bought])
        .then((result) => {
            res.send(result[0]);
            return;
        })
        .catch((error) => {
            console.log(error);
            return;
        })

});

//get furniture details
router.get("/furnitureDetails/:furniture_id/:clan_id", async (req, res, next) => {
    const data = [parseInt(req.params.furniture_id), parseInt(req.params.clan_id)]
    const sql = `select * from hiveFurniture hf join hiveShop hs on hf.furniture_id=hs.furniture_id where hf.furniture_id = ? and hf.clan_id=?`
    connection.promise().query(sql, data)
        .then((result) => {
            res.send(result[0]);
            return;
        })
        .catch((error) => {
            console.log(error);
            return;
        })

});

//update position of furniture
router.put("/updatePosition/:hiveFurniture_id", async (req, res, next) => {
    var hiveFurniture_id = parseInt(req.params.hiveFurniture_id);
    var position = req.body.position;
    var width = parseInt(req.body.width)
    if (isNaN(width)) {
        width = null
    }
    const data = [position, width, hiveFurniture_id]
    const sql = `update hiveFurniture set position=?, width=? where hiveFurniture_id=?`
    connection.promise().query(sql, data)
        .then((result) => {
            console.log(result[0]);
            res.send(result[0]);
            return;
        })
        .catch((error) => {
            console.log(error);
            return;
        })

});

//update width of furnitutre
router.put("/updateWidth/:hiveFurniture_id", async (req, res, next) => {
    var hiveFurniture_id = parseInt(req.params.hiveFurniture_id);
    var width = parseInt(req.body.width)
    const data = [width, hiveFurniture_id]
    const sql = `update hiveFurniture set width=? where hiveFurniture_id=?`
    connection.promise().query(sql, data)
        .then((result) => {
            console.log(result[0]);
            res.send(result[0]);
            return;
        })
        .catch((error) => {
            console.log(error);
            return;
        })

});

//getTotalClanPoint
router.get("/totalPrice", async (req, res, next) => {
    const sql = `SELECT sum(clan_points) totalPrice FROM hiveShop`
    connection.promise().query(sql)
        .then((result) => {
            res.send(result[0][0]);
            return;
        })
        .catch((error) => {
            console.log(error);
            return;
        })

});

//update hive score
router.put('/updateHiveScore/:clan_id', async (req, res, next) => {
    var clan_id = parseInt(req.params.clan_id);
    var hive_points = req.body.hive_points;
    var month = req.body.month;
    var year = req.body.year;
    var leaderboard_id = parseInt(clan_id + '' + month + '' + year)
    var body = [hive_points, month, year, leaderboard_id];
    const sql = `Update hive_leaderboard SET hive_points=?, month=?, year=? where leaderboard_id=?`
    connection.promise().query(sql, body)
        .then((result) => {
            if (result[0].affectedRows == 0) {
                const sql2 = `Insert into hive_leaderboard(clan_id,hive_points,month,year) values(?,?,?,?) `
                var body2 = [clan_id, hive_points, month, year];
                connection.promise().query(sql2, body2)
                    .then((result) => {
                        console.log(result[0]);
                        res.send(result[0]);
                        return;
                    })
                    .catch((error) => {
                        console.log(error);
                        res.send(error);
                        return;
                    })
            }
            else {
                res.send(result);
            }
            return;
        })
        .catch((error) => {
            res.send(error);
            return;
        });
})

//getTotalClanPoint
router.post("/hiveRank", async (req, res, next) => {
    var body = [parseInt(req.body.month), parseInt(req.body.year)]
    const sql = `SELECT * FROM hive_leaderboard where month=? and year=? order by hive_points desc`
    connection.promise().query(sql, body)
        .then((result) => {
            res.send(result[0]);
            return;
        })
        .catch((error) => {
            console.log(error);
            return;
        })

});

//deleteFurniture
router.delete("/deleteFurniture/:hiveFurniture_id", async (req, res, next) => {
    const sql = `delete from hiveFurniture where hiveFurniture_id=?`
    connection.promise().query(sql, parseInt(req.params.hiveFurniture_id))
        .then((result) => {
            res.send(result[0]);
            return;
        })
        .catch((error) => {
            console.log(error);
            return;
        })

});

router.post("/checkWin/:clan_id", async (req, res, next) => {
    var clan_id = parseInt(req.params.clan_id);
    var month = parseInt(req.body.month);
    var year = parseInt(req.body.year);
    var leaderboard_id = parseInt(clan_id + '' + month + '' + year)
    const sql = `SELECT * FROM hive_leaderboard where leaderboard_id=? order by hive_points desc`
    connection.promise().query(sql, leaderboard_id)
        .then((result) => {
            res.send(result[0]);
            return;
        })
        .catch((error) => {
            console.log(error);
            return;
        })

});

router.put('/updateClaimedStatus/:leaderboard_id', async (req, res, next) => {
    var claimed = req.body.claimed;
    console.log(req.body.claimed)
    console.log('slay');
    var leaderboard_id= parseInt(req.params.leaderboard_id)
    var data=[claimed,leaderboard_id]
    const sql = `Update hive_leaderboard SET claimed=? where leaderboard_id=?`
    connection.promise().query(sql, data)
        .then((result) => {
            res.send(result);
            return;
        })
        .catch((error) => {
            res.send(error);
            return;
        });
})


module.exports = router;