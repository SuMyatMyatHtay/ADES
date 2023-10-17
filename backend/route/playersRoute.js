const express = require('express');
const cors = require('cors');
const config = require('../config')
const bodyParser = require("body-parser");
let jwt = require('jsonwebtoken');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const router = express.Router();
router.use(bodyParser.json());
router.use(urlencodedParser);
router.use(cors());
const connection = require('../db'); //Import from db.js

//login
router.post("/login", async (req, res, next) => {
    if ((req.body.username == '' && req.body.email == '') || req.body.password == '') {
        res.status(400).send("Please fill in all inputs");
        return;
    }
   var last_login = new Date(req.body.last_login)
    const year = last_login.getFullYear();
    const month = ('0' + (last_login.getMonth() + 1)).slice(-2);
    const day = ('0' + last_login.getDate()).slice(-2);
    const hours = ('0' + last_login.getHours()).slice(-2);
    const minutes = ('0' + last_login.getMinutes()).slice(-2);
    const seconds = ('0' + last_login.getSeconds()).slice(-2);
    last_login = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    const sql = `SELECT player_username, email, password, player_id FROM player WHERE (player_username=? or email=?) and password=?`;
    const sql2 = `UPDATE player SET status=?,last_login=? where player_id =? `;
    const values = [req.body.username, req.body.email, req.body.password];
    connection.promise().query(sql, values)
        .then((result) => {
            console.log(result);
            if (result[0].length == 0) {
                res.send("Incorrect username or password");
                return;
            }
            else {
                const values2 = [req.body.status, last_login,result[0][0].player_id, ];
                connection.promise().query(sql2, values2)
                    .then((result2) => {
                        console.log(result2);
                        //api
                        let payload = {
                            "player_id": result[0][0].player_id,
                            "player_username": result[0][0].player_username,
                        }
                        //api key
                        let secret = config.key;
                        let options = {
                            'expiresIn': 86400
                        }
                        let token = jwt.sign(payload, secret, options);
                        let jsonData = {
                            'result2':result2,
                            'player_id': result[0][0].player_id,
                            "player_username": result[0][0].player_username,
                            "token": token,
                            "message": "You have successfully logged in"
                        }
                        res.send(jsonData);
                        return;
                    })
                    .catch((error) => {
                        console.log(error);
                        return;
                    })
            }
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
            return;
        });


});

//get all players in the game
router.get("/getAllPlayers", async (req, res, next) => {
    const sql = `SELECT * FROM player`;
    connection.promise().query(sql)
        .then((result) => {
            var totalInfo=[]
            //push players info together by players_id,players_username,email,passwords, image_id,gold, date_created, last_update, last_login,status
            var players_id = [], players_username = [], emails = [], passwords = [], image_id = [], gold = [], date_created = [], last_update = [], last_login = [], status = []
            for (let x = 0; x < result[0].length; x++) {
                players_id.push(result[0][x].player_id);
                players_username.push(result[0][x].player_username);
                emails.push(result[0][x].email);
                passwords.push(result[0][x].password);
                image_id.push(result[0][x].image_id);
                gold.push(result[0][x].gold);
                date_created.push(result[0][x].date_created);
                last_update.push(result[0][x].last_update);
                last_login.push(result[0][x].last_login);
                status.push(result[0][x].status);
            }
            // make 2d array of info
            totalInfo.push(players_id, players_username, emails, passwords, image_id, gold, date_created, last_update, last_login, status)
            console.log(totalInfo);
            res.send(totalInfo);
            return;
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
            return;
        });


});

//add new players
router.post("/addPlayer", async (req, res, next) => {
    if (req.body.player_id == null || req.body.username == '' || req.body.email == '' || req.body.password == null || req.body.image_id == '') {
        res.status(400).send('incomplete data');
        return;
    }
    const sql = `Insert into player(player_id,player_username,email,password,gold,image_id) values(?,?,?,?,?,?)`;
    const values = [req.body.player_id, req.body.username, req.body.email, req.body.password, req.body.gold, req.body.image_id];
    connection.promise().query(sql, values)
        .then((result) => {
            let jsonMessage = {
                "player_id": result[0].insertId,
                "message": "Congrats you are now a player!"
            }
            console.log(result);
            res.send(jsonMessage);
        })
        .catch((error) => {
            console.log("catch");
            console.log(error)
            res.send(error)
            return;
        });


});

//get player's image
router.get("/getPlayerAvatar/:image_id", async (req, res, next) => {
    const image_id = parseInt(req.params.image_id);
    const sql = `SELECT image_path FROM player_avatar where image_id=? `;
    connection.promise().query(sql, image_id)
        .then((result) => {
            res.send(result[0][0].image_path)
            return;
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
            return;
        });


});

//get all images available
router.get("/getImages", async (req, res, next) => {
    var female_images = [];
    var male_images = [];
    const sql = `SELECT image_id from player_avatar where image_path like '%female%'`
    connection.promise().query(sql)
        .then((result) => {
            result[0].forEach((obj) => {
                female_images.push(obj.image_id)
            })

            const sql2 = `SELECT image_id from player_avatar where image_path not like '%female%'`;
            connection.promise().query(sql2)
                .then((result2) => {
                    result2[0].forEach((obj) => {
                        male_images.push(obj.image_id)
                    })

                    let jsonData = {
                        "male_Images": male_images,
                        "female_Images": female_images
                    }

                    res.send(jsonData)
                    return;
                })
                .catch((error) => {
                    console.log(error)
                    res.send(error)
                    return;
                });

        })
        .catch((error) => {
            console.log(error)
            res.send(error)
            return;
        });
});

//get player's info
router.get("/getPlayerInfo/:player_id", async (req, res, next) => {
    const player_id = parseInt(req.params.player_id);
    const sql = `SELECT * from player where player_id=? `;
    connection.promise().query(sql, player_id)
        .then((result) => {
            console.log(result);
            let jsonData = {
                "player_id": result[0][0].player_id,
                "player_username": result[0][0].player_username,
                "email": result[0][0].email,
                "password": result[0][0].password,
                "image_id": result[0][0].image_id,
                "gold": result[0][0].gold,
                "date_created": result[0][0].date_created,
                "last_update": result[0][0].last_update
            }
            res.send(jsonData);
            return;
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
            return;
        });


});

//update gold for player
router.put("/updateGold/:player_id", async (req, res, next) => {
    const player_id = parseInt(req.params.player_id);
    const gold = parseFloat(req.body.gold).toFixed(2);
    const data = [gold, player_id]
    const sql = `UPDATE player SET gold=gold+? where player_id=?`;
    connection.promise().query(sql, data)
        .then((result) => {
            console.log(result);
            res.send(result);
            return;
        })
        .catch((error) => {
            console.log(error);
            res.send(error);
            return;
        });

})


//update player password
router.put("/updatePassword", async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    if (req.body.email == '' || req.body.password == '' || req.body.email == null || req.body.password == null) {
        res.status(400).send("Please fill in all inputs");
        return;
    }
    const data = [password, email, email]
    const sql = `update player set password =? where email=? or player_username=?`;
    connection.promise().query(sql, data)
        .then((result) => {
            console.log(result);
            res.send(result);
            return;
        })
        .catch((error) => {
            console.log(error);
            res.send(error);
            return;
        });

})

router.get("/getNumberOfCards/:player_id", async (req, res, next) => {
    const player_id = parseInt(req.params.player_id);
    const sql = `SELECT count(card_id) cardsNo from card_collection where player_id=?`;
    connection.promise().query(sql, player_id)
        .then((result) => {
            res.send(result[0]);
            return;
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
            return;
        });


});

//get player's image right away...
//get player's info
router.get("/getPlayerInfoImage/:player_id", async (req, res, next) => {
    const player_id = parseInt(req.params.player_id);
    const sql = `SELECT * from player p join player_avatar i on i.image_id=p.image_id where player_id=?  `;
    connection.promise().query(sql, player_id)
        .then((result) => {
            console.log(result);
            let jsonData = {
                "player_id": result[0][0].player_id,
                "player_username": result[0][0].player_username,
                "email": result[0][0].email,
                "password": result[0][0].password,
                "image_path": result[0][0].image_path,
                "gold": result[0][0].gold,
                "date_created": result[0][0].date_created,
                "last_update": result[0][0].last_update
            }
            res.send(jsonData);
            return;
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
            return;
        });


});




module.exports = router;