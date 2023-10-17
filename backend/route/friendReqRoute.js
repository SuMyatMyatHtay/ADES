const express = require("express");
const router = express.Router();
const connection = require('../db'); //Import from db.js
console.log("This is friendReqRoute route");


router.post('/getAllFriReq/:playerid', (req, res, next) => {
    let playerID = req.params.playerid;

    const SQLSTATEMENT = `
                        SELECT 
                            p1.*, pa.image_path AS avatar
                        FROM 
                            friendRequest AS fr, 
                            player_avatar AS pa, 
                            player AS p, 
                            player AS p1
                        WHERE 
                            p.player_id = fr.ReceiverID AND 
                            p1.player_id = fr.SenderID AND 
                            pa.image_id = p1.image_id AND 
                            fr.ReceiverID = ${playerID}                            
    `;
    const VALUES = [playerID];

    connection.promise().query(SQLSTATEMENT, VALUES)
        .then(([rows, fields]) => {
            console.log(rows.length + ' same trading request exists!');
            res.json(rows);
        })
        .catch((error) => {
            console.log(error)
            res.send(error);
        });
})

//Add into the friendship table 
router.post('/addToFriendship/:playerid/:friendshipID', (req, res, next) => {
    let playerID = req.params.playerid;
    let friendID = req.params.friendshipID;

    const SQLSTATEMENT = `
    INSERT INTO friendshipRelation (PlayerID_Send, PlayerID_Accept)
    VALUES (${friendID}, ${playerID}) 
    
`;
    const VALUES = [friendID, playerID];

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

router.delete('/friReqDelete/:playerid/:friendshipID', (req, res, next) => {
    let playerID = req.params.playerid;
    let friendID = req.params.friendshipID

    const SQLSTATEMENT = `
                        DELETE FROM friendRequest 
                        WHERE (SenderID = ${friendID} AND ReceiverID = ${playerID}) 
                        OR (SenderID = ${playerID} AND ReceiverID = ${friendID}) 
    `;

    const VALUES = [friendID, playerID];
    connection.promise().query(SQLSTATEMENT, VALUES)
        .then(([rows, fields]) => {
            console.log(rows);
            res.send(rows);
        })
        .catch((error) => {
            console.log(error);
            res.send(error);
        });
})

module.exports = router;