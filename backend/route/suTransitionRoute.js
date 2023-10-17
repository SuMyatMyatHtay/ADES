const express = require("express");
const router = express.Router();
const connection = require('../db'); //Import from db.js
console.log("This is search route");

router.get('/friendBase/:playerid', (req, res, next) => {
    console.log(req.params);
    let playerid = req.params.playerid;

    const SQLSTATEMENT = `
    SELECT 
        CASE WHEN fr.PlayerID_Send = ${playerid} THEN p1.player_username ELSE p2.player_username END AS PlayerName, 
        CASE WHEN fr.PlayerID_Send = ${playerid} THEN p2.player_username ELSE p1.player_username END AS FriendName, 
        CASE WHEN fr.PlayerID_Send = ${playerid} THEN id1.player_id ELSE id2.player_id END AS PlayerID, 
        CASE WHEN fr.PlayerID_Send = ${playerid} THEN id2.player_id ELSE id1.player_id END AS FriendID,
        CASE WHEN fr.PlayerID_Send = ${playerid} THEN id2.image_id ELSE id1.image_id END AS ImageID,
        pa.image_path
    FROM 
        friendshipRelation fr 
        JOIN player p1 ON fr.PlayerID_Send = p1.player_id 
        JOIN player p2 ON fr.PlayerID_Accept = p2.player_id 
        JOIN player id1 ON p1.player_username = id1.player_username 
        JOIN player id2 ON p2.player_username = id2.player_username 
        JOIN player_avatar pa ON CASE WHEN fr.PlayerID_Send = ${playerid} THEN id2.image_id ELSE id1.image_id END = pa.image_id 
    WHERE 
    ${playerid} IN (fr.PlayerID_Send, fr.PlayerID_Accept);


    `;
    const VALUES = [playerid];

    connection.promise().query(SQLSTATEMENT, VALUES)
        .then(([rows, fields]) => {
            console.log(rows);
            res.json(rows);
        })
        .catch((error) => {
            console.log(error)
            res.send(error);
        });
});

//This is no longer in use. 
router.get('/friendBase/:playerid/:friendid', (req, res, next) => {
    console.log(req.params);
    let friendid = req.params.friendid;

    const SQLSTATEMENT = `
                SELECT 
                    * 
                FROM 
                    player AS p
                WHERE 
                    p.player_id = ${friendid}
    `;
    const VALUES = [friendid];

    connection.promise().query(SQLSTATEMENT, VALUES)
        .then(([rows, fields]) => {
            console.log(rows);
            res.json(rows);
        })
        .catch((error) => {
            console.log(error)
            res.send(error);
        });
});
module.exports = router;