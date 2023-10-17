const express = require("express");
const router = express.Router();
const connection = require('../db'); //Import from db.js
console.log("This is trading route");
//const PLAYERID = localStorage.getItem("PlayerID");

router.get('/cardtrading/:playerid', (req, res, next) => {
    console.log(req.params);
    let playerID = req.params.playerid;

    const SQLSTATEMENT = `
        SELECT 
            card.card_id, card.creature_name, GROUP_CONCAT(card_attack.attack_name) AS attack_names, MAX(attack.attack_damage) AS max_attack_damage, card.hit_points, card_image.card_image
        FROM 
            card_collection 
        INNER 
            JOIN card ON card_collection.card_id = card.card_id 
        INNER
            JOIN card_attack ON card_attack.creature_name = card.creature_name
        INNER 
            JOIN attack ON card_attack.attack_name = attack.attack_name
        INNER 
            JOIN card_image ON card_image.creature_name = card.creature_name
        WHERE 
            card_collection.player_id = ${playerID}
        GROUP BY 
            card.card_id, card.creature_name, card.hit_points, card_image.card_image;
        ;
            
    `;
    const VALUES = [playerID];

    connection.promise().query(SQLSTATEMENT, VALUES)
        .then(([rows, fields]) => {
            //removing duplicate rows
            /*
            for (let i = 0; i < rows.length; i++) {
                rows[i]['attack_name'] = [rows[i]['attack_name']]
                for (let j = i + 1; j < rows.length; j++) {
                    if (rows[i]['creature_name'] == rows[j]['creature_name']) {
                        if (rows.indexOf(rows[j]['attack_name']) == -1) {
                            rows[i]['attack_name'].push(rows[j]['attack_name'])
                            rows.splice(j, 1)
                            console.log(rows[i]);
                        }
                    }
                }

            }
            */
            console.log(rows);
            res.json(rows);
        })
        .catch((error) => {
            console.log(error)
            res.send(error);
        });
});

router.get('/cardtrading/:playerid/:friendid', (req, res, next) => {
    console.log(req.params);
    let playerID = req.params.playerid;
    let friendID = req.params.friendid;

    const SQLSTATEMENT = `
        SELECT 
            card.card_id, card.creature_name, GROUP_CONCAT(card_attack.attack_name) AS attack_names, MAX(attack.attack_damage) AS max_attack_damage, card.hit_points, card_image.card_image
        FROM 
            card_collection 
        INNER 
            JOIN card ON card_collection.card_id = card.card_id 
        INNER
            JOIN card_attack ON card_attack.creature_name = card.creature_name
        INNER 
            JOIN attack ON card_attack.attack_name = attack.attack_name
        INNER 
            JOIN card_image ON card_image.creature_name = card.creature_name
        WHERE 
            card_collection.player_id = ${friendID}
        GROUP BY 
            card.card_id, card.creature_name, card.hit_points, card_image.card_image;
        ;
            
    `;
    const VALUES = [playerID, friendID];

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

router.post('/tradebutton', (req, res, next) => {
    let PlayerID = req.body.playerID;
    let FriendID = req.body.friendID;
    let toBeMine = req.body.toBeMine;
    let toBeTheirs = req.body.toBeTheirs;

    //console.log(PlayerID, FriendID, toBeMine, toBeTheirs)

    const SQLSTATEMENT = `
            INSERT INTO trade_request (PlayerID, FriendID, SelectedCardID_PlayerGet, SelectedCardID_FriendGet)
            VALUES (${PlayerID}, ${FriendID}, ${toBeMine}, ${toBeTheirs}) 
            
    `;
    const VALUES = [PlayerID, FriendID, toBeMine, toBeTheirs];

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

router.post('/tradeRequestCheck', (req, res, next) => {
    let PlayerID = req.body.playerID;
    let FriendID = req.body.friendID;
    let toBeMine = req.body.toBeMine;
    let toBeTheirs = req.body.toBeTheirs;

    const SQLSTATEMENT = `
            SELECT 
                * 
            FROM 
                trade_request 
            WHERE 
                PlayerID = ${PlayerID} AND FriendID = ${FriendID} AND SelectedCardID_PlayerGet = ${toBeMine} AND SelectedCardID_FriendGet = ${toBeTheirs} AND TradingStatus = "open"
    `;
    const VALUES = [PlayerID, FriendID, toBeMine, toBeTheirs];

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

router.post('/getAllTradingReq/:playerid', (req, res, next) => {
    let playerID = req.params.playerid;

    const SQLSTATEMENT = `
                    SELECT 
                        tr.TradingRequestID,
                        p.player_username AS tradingWith,
                        tr.SelectedCardID_PlayerGet AS cardToGiveID,
                        c.creature_name AS cardToGiveName,
                        tr.SelectedCardID_FriendGet AS cardToReceiveID,
                        c1.creature_name AS cardToReceiveName,
                        tr.PlayerID AS tradeOffererID,
                        tr.FriendID AS PlayerID,
                        ci.card_image AS cardToGiveImage,
                        ci1.card_image AS cardToReceiveImage,
                        c.hit_points AS cardToGiveHP,
                        c1.hit_points AS cardToReceiveHP,
                        GROUP_CONCAT(ca.attack_name) AS cardToGiveAN,
                        (
                            SELECT GROUP_CONCAT(DISTINCT ca1.attack_name)
                            FROM card_attack AS ca1
                            WHERE c1.creature_name = ca1.creature_name
                        ) AS cardToReceiveAN
                    FROM 
                        trade_request AS tr
                        INNER JOIN player AS p ON tr.PlayerID = p.player_id
                        INNER JOIN card AS c ON tr.SelectedCardID_PlayerGet = c.card_id
                        INNER JOIN card AS c1 ON tr.SelectedCardID_FriendGet = c1.card_id
                        INNER JOIN card_image AS ci ON c.creature_name = ci.creature_name
                        INNER JOIN card_image AS ci1 ON c1.creature_name = ci1.creature_name
                        INNER JOIN card_attack AS ca ON c.creature_name = ca.creature_name
                    WHERE 
                        tr.TradingStatus = 'open' AND 
                        tr.FriendID = ${playerID}
                    GROUP BY 
                        tr.TradingRequestID;


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

router.put('/tradingAccept/:playerid', (req, res, next) => {

    let playerID = req.params.playerid;

    let cardToGiveID = req.body.cardToGiveID;
    let tradeOffererID = req.body.tradeOffererID;
    let cardToReceiveID = req.body.cardToReceiveID;

    const SQLSTATEMENT0 = `
                    UPDATE card_collection
                    SET card_id = 0
                    WHERE player_id = ${playerID} AND card_id = ${cardToGiveID};
`;

    const SQLSTATEMENT1 = `
                    UPDATE card_collection
                    SET card_id = ${cardToGiveID}
                    WHERE player_id = ${tradeOffererID} AND card_id = ${cardToReceiveID};
`;
    const SQLSTATEMENT2 = `
                    UPDATE card_collection
                    SET card_id = ${cardToReceiveID}
                    WHERE player_id = ${playerID} AND card_id = 0; 
`;
    const VALUES0 = [playerID, cardToGiveID];
    const VALUES1 = [cardToGiveID, tradeOffererID, cardToReceiveID];
    const VALUES2 = [cardToReceiveID, playerID, cardToGiveID];

    connection.promise().query(SQLSTATEMENT0, VALUES0)
        .then(([rows, fields]) => {
            console.log(SQLSTATEMENT0, "SQL0")
            console.log(VALUES0, "Values0")

            console.log(rows);
            connection.promise().query(SQLSTATEMENT1, VALUES1)
                .then(([rows, fields]) => {
                    console.log(SQLSTATEMENT1, "SQL1")
                    console.log(VALUES1, "Values1")

                    console.log(rows);
                    // Execute the second query inside the callback function of the first query
                    connection.promise().query(SQLSTATEMENT2, VALUES2)
                        .then(([rows, fields]) => {
                            console.log(SQLSTATEMENT2, "SQL2")
                            console.log(VALUES2, "Values2")

                            console.log(rows);
                            res.json(rows);
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
})

//currently not using 
router.delete('/tradingAcceptThenDelete', (req, res, next) => {
    let cardToGiveID = req.body.cardToGiveID;
    let cardToReceiveID = req.body.cardToReceiveID;

    const SQLSTATEMENT = `
                        DELETE FROM trade_request 
                        WHERE SelectedCardID_FriendGet = ${cardToReceiveID} AND SelectedCardID_PlayerGet = ${cardToGiveID}
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

router.put('/changeTradingStatus', (req, res, next) => {
    let cardToGiveID = req.body.cardToGiveID;
    let cardToReceiveID = req.body.cardToReceiveID;
    let result = req.body.result;

    const SQLSTATEMENT = `
        UPDATE trade_request
        SET TradingStatus = "close", Result = "${result}"
        WHERE SelectedCardID_PlayerGet = ${cardToGiveID} AND SelectedCardID_FriendGet = ${cardToReceiveID};
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

router.delete('/sideTradingReqDelete', (req, res, next) => {
    let cardToGiveID = req.body.cardToGiveID;
    let cardToReceiveID = req.body.cardToReceiveID;

    const SQLSTATEMENT = `
                        DELETE FROM trade_request 
                        WHERE TradingStatus = 'open' AND (
                        SelectedCardID_FriendGet = ${cardToReceiveID} OR 
                        SelectedCardID_FriendGet = ${cardToGiveID} OR 
                        SelectedCardID_PlayerGet = ${cardToReceiveID} OR 
                        SelectedCardID_PlayerGet = ${cardToGiveID} ) 
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


router.post('/tradingReqCount/:player_id', (req, res, next) => {
    let player_id = req.params.player_id;

    const SQLSTATEMENT = `
                SELECT 
                    EXTRACT(MONTH FROM Timestamp) AS month,
                    SUM(CASE WHEN Result = 'accepted' THEN 1 ELSE 0 END) AS accepted_count,
                    SUM(CASE WHEN Result = 'rejected' THEN 1 ELSE 0 END) AS rejected_count,
                    SUM(CASE WHEN Result = 'pending' THEN 1 ELSE 0 END) AS pending_count
                FROM 
                    trade_request
                WHERE 
                    PlayerID = ${player_id}
                    AND EXTRACT(YEAR FROM Timestamp) = EXTRACT(YEAR FROM CURRENT_DATE)
                GROUP BY 
                    EXTRACT(MONTH FROM Timestamp);
    `;
    const VALUES = [player_id];

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

router.post('/anotherRouterPos', async (req, res) => {
    let playerid = req.params.player_id;

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
})

router.post('/friIDArray', async (req, res) => {
    try {
        let playerid = req.params.player_id;

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

        const [rows] = await connection.promise().query(SQLSTATEMENT, VALUES);

        // Extract the necessary values from the query result
        const values = rows.map((row) => row.FriendID);

        return values;

        // // Run the concurrent requests using the extracted values
        // const requestPromises = values.map((value) => {
        //     // Create a promise for each iteration of the loop
        //     return new Promise((resolve, reject) => {
        //         // Perform necessary operations using the value from the query result
        //         // ...

        //         // Resolve or reject the promise based on the result of the operations
        //         if (rows == "sth") {
        //             resolve(/* result */);
        //         } else {
        //             reject(/* error */);
        //         }
        //     });
        // });

        // // Wait for all promises to resolve or reject
        // const results = await Promise.all(requestPromises);

        // // Handle the results
        // // ...

        // res.send(results);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

router.get('/friIDArray/:playerid', (req, res, next) => {
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
            const values = rows.map((row) => row.FriendID);
            console.log(values);
            res.json(values);
        })
        .catch((error) => {
            console.log(error)
            res.send(error);
        });
});

router.post('/statistics2', async (req, res) => {
    const requestPromises = [];
    //const response = await axios.post('http://localhost:3000/api/tradingRoute/friendBase/1');
    //const values = response.data;
    //console.log(values)

    let values = req.body.friArray;
    let tempState = req.body.statee;
    //const values = [1, 3, 6, 8]

    for (let tempi = 0; tempi < values.length; tempi++) {
        requestPromises.push(connection.promise().query(`SELECT p.player_username, IFNULL(COUNT(tr.TradingRequestID), 0) AS AcceptedNum
        FROM player AS p
        LEFT JOIN trade_request AS tr ON tr.PlayerID = p.player_id AND tr.Result = '${tempState}'
        WHERE p.player_id = ${values[tempi]};`)

            .then((rows) => {
                console.log("something")
                // Process the query result and calculate statistics
                const playerData = rows[0]; // Assuming one row is returned
                // const stats = {
                //     playerId: playerData.id,
                //     playerName: playerData.name,
                //     totalScore: calculateTotalScore(playerData),
                //     // Other statistics calculations
                // };
                //res.send(playerData);
                return playerData;
            })
            .catch((error) => {
                // Handle any errors that occur during the query
                res.send(error);
                throw error;
            }))
    }

    try {
        // Wait for all promises to resolve
        const results = await Promise.all(requestPromises);
        console.log("promise.all please work ")
        res.send(results);
    } catch (error) {
        // Handle any errors that occurred during the requests
        res.send(error);
    }

})

// router.post('/concurrent', async (req, res) => {
//     try {
//         // Make a POST request to execute the /anotherRouterPost route
//         const response = await axios.post('/anotherRouterPost', req.body);

//         // Access the response data from the /anotherRouterPost route
//         const values = response.data;

//         // Run the concurrent requests using the extracted values
//         const requestPromises = values.map((value) => {
//             // Create a promise for each iteration of the loop
//             return new Promise((resolve, reject) => {
//                 // Perform necessary operations using the value from the previous query
//                 // ...

//                 // Resolve or reject the promise based on the result of the operations
//                 if (values == 'dd') {
//                     resolve(/* result */);

//                 }
//                 else {
//                     reject(/* error */);
//                 }
//             })
//         })
//     }
// })



module.exports = router;