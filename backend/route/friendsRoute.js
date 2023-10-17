const express = require("express");
const router = express.Router();
const connection = require('../db'); //Import from db.js
console.log("This is search route");

//print out the name and id of friends 
router.get('/', async (req, res, next) => {
    try {
        console.log("Print out all the friends I have");
        const allFriends = await connection.promise().query(`
        
        SELECT fr.PlayerID_Send, fr.PlayerID_Accept, p1.player_username AS Player1Name, p2.player_username AS Player2Name FROM friendshipRelation fr JOIN player p1 ON fr.PlayerID_Send = p1.player_id JOIN player p2 ON fr.PlayerID_Accept = p2.player_id;
                                                    
                                                    `);
        res.json(allFriends[0]);
    }
    catch (error) {
        console.log(error);
        res.send(error);
    }
})

//print out the name and id of friends based on player id
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

router.post('/getAllFriends/:playerid', (req, res, next) => {
    let playerid = req.params.playerid;

    const SQLSTATEMENT = `
    SELECT 
        CASE 
            WHEN fr.playerID_Send = ${playerid} THEN fr.playerID_Accept
            ELSE fr.playerID_Send
        END AS friendID
    FROM 
        friendshipRelation AS fr
    WHERE 
        (fr.playerID_Send = ${playerid} AND fr.playerID_Accept <> ${playerid}) OR
        (fr.playerID_Accept = ${playerid} AND fr.playerID_Send <> ${playerid});


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

})

router.post('/getFriCount/:playerid', (req, res, next) => {
    let playerid = req.params.playerid;


    const SQLSTATEMENT = `
    SELECT 
        COUNT(*) AS rowCount
    FROM 
        friendshipRelation AS fr
    WHERE 
        (fr.playerID_Send = ${playerid} AND fr.playerID_Accept <> ${playerid}) OR
        (fr.playerID_Accept = ${playerid} AND fr.playerID_Send <> ${playerid});
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

})

router.delete('/unfriend/:playerid/friends/:friendid', (req, res, next) => {
    let playerid = req.params.playerid;
    let friendid = req.params.friendid;

    const SQLSTATEMENT = `
                        DELETE FROM friendshipRelation 
                        WHERE (PlayerID_Send = ${friendid} AND PlayerID_Accept = ${playerid}) 
                        OR (PlayerID_Send = ${playerid} AND PlayerID_Accept = ${friendid}) 
    `;
    const VALUES = [playerid, friendid];

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

router.delete('/deleteDuplicateFriends/:playerID/:playerWhoSend', (req, res, next) => {
    let acceptPlayer = req.params.playerID;
    let playerWhoSend = req.params.playerWhoSend;

    const SQLSTATEMENT = `
    DELETE t1
    FROM friendshipRelation t1
    JOIN friendshipRelation t2 
      ON t1.PlayerID_Send = t2.PlayerID_Send AND t1.PlayerID_Accept = t2.PlayerID_Accept
    WHERE t1.friendshipID > t2.friendshipID AND t1.PlayerID_Send = ${playerWhoSend} AND t1.PlayerID_Accept = ${acceptPlayer};
    `;
    const VALUES = [playerWhoSend, acceptPlayer];

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