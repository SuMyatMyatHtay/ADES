//This is the search route TEsting

const express = require("express");
const router = express.Router();
const connection = require('../db'); //Import from db.js
console.log("This is search route");

//It prints out all the player from 1 except the current user 
//can modify by limiting and randomising
router.post('/searchWithID/:playerid', (req, res, next) => {
    console.log(req.params);
    let playerid = req.params.playerid;

    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const keywordSearch = urlParams.get('keywordSearch');

    // console.log(`Player ID: ${playerid}`);
    // console.log(`keywordSearch: ${keywordSearch}`);
    // console.log("This is the queryString : " + keywordSearch);
    console.log(`keywordSearch: ${keywordSearch}`)
    console.log(keywordSearch == "");

    if (keywordSearch == "" || keywordSearch == null) {
        var SQLSTATEMENT = `
        SELECT player.*, av.image_path, 0 AS friCheck, 0 AS ReqCheck, 0 AS CancelCheck
        FROM player, player_avatar AS av 
        WHERE player_id <> ${playerid} 
        AND av.image_id = player.image_id
        AND player_id NOT IN (
          SELECT playerID_Send FROM friendshipRelation WHERE playerID_Accept = ${playerid} 
          UNION ALL
          SELECT playerID_Accept FROM friendshipRelation WHERE playerID_Send = ${playerid} 
        )
        AND player_id NOT IN (
        SELECT ReceiverID
        FROM friendRequest
        WHERE ReceiverID = ${playerid} 
        UNION ALL
          SELECT SenderID
        FROM friendRequest
        WHERE ReceiverID = ${playerid} 
    )
    AND player_id NOT IN (
        SELECT ReceiverID
        FROM friendRequest
        WHERE SenderID = ${playerid} 
        UNION ALL
          SELECT SenderID
        FROM friendRequest
        WHERE SenderID = ${playerid} 
    )
    
        LIMIT 20;
        `
    }
    else {

        var SQLSTATEMENT = `
                    SELECT
                        player.*, pa.image_path,
                        CASE
                            WHEN friendshipRelation.PlayerID_Send = player.player_id AND friendshipRelation.PlayerID_Accept = friend.player_id THEN 1
                            WHEN friendshipRelation.PlayerID_Send = friend.player_id AND friendshipRelation.PlayerID_Accept = player.player_id THEN 1
                            ELSE 0
                        END AS friCheck, 
                        CASE
                            WHEN EXISTS (
                                SELECT *
                                FROM friendRequest
                                WHERE ReceiverID = friend.player_id
                                AND SenderID = player.player_id
                            ) THEN 1
                            ELSE 0
                        END AS ReqCheck,
                        CASE
                        WHEN EXISTS (
                            SELECT *
                            FROM friendRequest
                            WHERE ReceiverID = player.player_id
                            AND SenderID = friend.player_id
                        ) THEN 1
                        ELSE 0
                    END AS CancelCheck
                    FROM
                        player
                    INNER JOIN
                        player AS friend ON friend.player_id = ${playerid} 
                    INNER JOIN 
						player_avatar AS pa ON pa.image_id = player.image_id
                    LEFT JOIN
                        friendshipRelation ON (friendshipRelation.PlayerID_Send = player.player_id AND friendshipRelation.PlayerID_Accept = friend.player_id)
                                            OR (friendshipRelation.PlayerID_Send = friend.player_id AND friendshipRelation.PlayerID_Accept = player.player_id)
                    WHERE
                        player.player_id = ${keywordSearch} 
        `

        // var SQLSTATEMENT = `
        //             SELECT 
        //                 *
        //             FROM 
        //                 player
        //             WHERE 
        //                 ${keywordSearch} = player_id
        // `
    }


    const VALUES = [playerid, keywordSearch];
    //console.log(SQLSTATEMENT)

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

router.post('/searchWithName/:playerid', (req, res, next) => {
    console.log(req.params);
    console.log("This is searching with name")
    let playerid = req.params.playerid;

    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const keywordSearch = urlParams.get('keywordSearch');
    const keywordID = urlParams.get('keywordID');
    console.log(`keywordID: ${keywordID}`)
    console.log(keywordID == "");

    if (keywordID == null || keywordID == "") {
        var SQLSTATEMENT = `

                        SELECT
                            player.*, pa.image_path,
                            CASE
                                WHEN friendshipRelation.PlayerID_Send = player.player_id AND friendshipRelation.PlayerID_Accept = friend.player_id THEN 1
                                WHEN friendshipRelation.PlayerID_Send = friend.player_id AND friendshipRelation.PlayerID_Accept = player.player_id THEN 1
                                ELSE 0
                            END AS friCheck, 
                            CASE
                                WHEN EXISTS (
                                    SELECT *
                                FROM friendRequest
                                WHERE ReceiverID = friend.player_id
                                AND SenderID = player.player_id
                                ) THEN 1
                                ELSE 0
                            END AS ReqCheck,
                            CASE
                            WHEN EXISTS (
                                SELECT *
                                FROM friendRequest
                                WHERE ReceiverID = player.player_id
                                AND SenderID = friend.player_id
                            ) THEN 1
                            ELSE 0
                        END AS CancelCheck
                        FROM
                            player
                        INNER JOIN
                            player AS friend ON friend.player_id = ${playerid} 
                        INNER JOIN 
                            player_avatar AS pa ON pa.image_id = player.image_id
                        LEFT JOIN
                            friendshipRelation ON (friendshipRelation.PlayerID_Send = player.player_id AND friendshipRelation.PlayerID_Accept = friend.player_id)
                                                OR (friendshipRelation.PlayerID_Send = friend.player_id AND friendshipRelation.PlayerID_Accept = player.player_id)
                        WHERE
                            player.player_username = "${keywordSearch}"

                    
        `
    }
    else {
        var SQLSTATEMENT = `
                    SELECT
                        player.*, pa.image_path,
                        CASE
                            WHEN friendshipRelation.PlayerID_Send = player.player_id AND friendshipRelation.PlayerID_Accept = friend.player_id THEN 1
                            WHEN friendshipRelation.PlayerID_Send = friend.player_id AND friendshipRelation.PlayerID_Accept = player.player_id THEN 1
                            ELSE 0
                        END AS friCheck, 
                        CASE
                            WHEN EXISTS (
                                SELECT *
                                FROM friendRequest
                                WHERE ReceiverID = friend.player_id
                                AND SenderID = player.player_id
                            ) THEN 1
                            ELSE 0
                        END AS ReqCheck,
                        CASE
                            WHEN EXISTS (
                                SELECT *
                                FROM friendRequest
                                WHERE ReceiverID = player.player_id
                                AND SenderID = friend.player_id
                            ) THEN 1
                            ELSE 0
                        END AS CancelCheck
                    FROM
                        player
                    INNER JOIN
                        player AS friend ON friend.player_id = ${playerid} 
                    INNER JOIN 
						player_avatar AS pa ON pa.image_id = player.image_id
                    LEFT JOIN
                        friendshipRelation ON (friendshipRelation.PlayerID_Send = player.player_id AND friendshipRelation.PlayerID_Accept = friend.player_id)
                                            OR (friendshipRelation.PlayerID_Send = friend.player_id AND friendshipRelation.PlayerID_Accept = player.player_id)
                    WHERE 
                        player.player_username = "${keywordSearch}" AND 
                        player.player_id = ${keywordID}
            `
    }
    const VALUES = [playerid, keywordSearch];
    //console.log(SQLSTATEMENT)

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


//Checking whether already friends or not 
router.post('/checFriOrNot/:playerid', (req, res, next) => {

    let playerid = req.params.playerid;
    let friendID = req.body.friendID

    const SQLSTATEMENT = `
                    SELECT 
                        * 
                    FROM 
                        friendshipRelation
                    WHERE 
                        (PlayerID_Send = ${playerid} AND PlayerID_Accept = ${friendID}) OR 
                        (PlayerID_Accept = ${playerid} AND PlayerID_Send = ${friendID})
    `;
    const VALUES = [playerid, friendID];

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


//Idk where the fuck did I use this 
router.get('/searchWithIDTwo/:playerid/:friendid', (req, res, next) => {
    console.log(req.params);
    let playerid = req.params.playerid;
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

router.post('/checkDuplicateFriReq', (req, res, next) => {

    let playerid = req.body.mainplayer_id;
    let friendID = req.body.friendID

    const SQLSTATEMENT = `
                    SELECT 
                        * 
                    FROM 
                        friendRequest 
                    WHERE 
                        SenderID = ${playerid} AND ReceiverID = ${friendID}
    `;
    const VALUES = [playerid, friendID];

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

//Sending Friend Request 
router.post('/checkDuplicateFriReqToAccept', (req, res, next) => {

    let playerid = req.body.mainplayer_id;
    let friendID = req.body.friendID

    const SQLSTATEMENT = `
                    SELECT 
                        * 
                    FROM 
                        friendRequest 
                    WHERE 
                        ReceiverID = ${playerid} AND SenderID = ${friendID}
    `;
    const VALUES = [playerid, friendID];

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

router.post('/sentFriReq', (req, res, next) => {
    console.log(req.body);
    let playerid = req.body.mainplayer_id;
    let friendID = req.body.friendID


    var SQLSTATEMENT = `
                INSERT INTO friendRequest (SenderID, ReceiverID)
                VALUES (${playerid}, ${friendID}) 
        `

    const VALUES = [playerid, friendID];
    //console.log(SQLSTATEMENT)

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

//Accepting friend request 
router.post('/acceptFriReq', (req, res, next) => {
    console.log(req.body);
    let playerid = req.body.mainplayer_id;
    let friendID = req.body.friendID


    var SQLSTATEMENT = `
                INSERT INTO friendshipRelation (PlayerID_Accept, PlayerID_Send)
                VALUES (${playerid}, ${friendID}) 
        `

    const VALUES = [playerid, friendID];
    //console.log(SQLSTATEMENT)

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

router.delete('/friReqDelete', (req, res, next) => {
    let playerid = req.body.mainplayer_id;
    let friendID = req.body.friendID

    const SQLSTATEMENT = `
                        DELETE FROM friendRequest 
                        WHERE ReceiverID = ${playerid} AND SenderID = ${friendID}
    `;

    const VALUES = [cardToReceiveID, cardToGiveID];
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


//Testin post for Search Function 
/*
router.post('/:playerid/:keyword', (req, res) => {
    let keyword = req.params.keyword;
    console.log('Successfully conected to backend with frontend')
    const SQLSTATEMENT = `
                SELECT 
                    * 
                FROM 
                    player AS p
                WHERE 
                    p.player_id = ${keyword}
    `;
    const VALUES = [keyword];

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
*/

module.exports = router;