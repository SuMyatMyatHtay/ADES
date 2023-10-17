const express = require("express");
const router = express.Router();
const connection = require('../db'); //Import from db.js
console.log("This is black room random route");

router.post('/checkingEC', async (req, res) => {
    let month = req.body.month;
    let year = req.body.year;

    const SQLSTATEMENT = `
    SELECT 
        * 
    FROM 
        epicCardsSu
    WHERE 
        month = ${month} AND year = ${year}
    `;
    const VALUES = [month, year];

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

router.post('/checkAttack', async (req, res) => {
    let creature_name = req.body.creature_name;

    const SQLSTATEMENT = `
    SELECT 
        * 
    FROM 
        card_attack
    WHERE 
        creature_name = '${creature_name}'
    `;
    const VALUES = [creature_name];

    connection.promise().query(SQLSTATEMENT, VALUES)
        .then(([rows, fields]) => {
            console.log(rows, 'rows');
            var resultTemp = "";
            for (var i = 0; i < rows.length; i++) {
                if (i == 0) {
                    resultTemp += rows[i].attack_name
                }
                else {
                    resultTemp += `, ${rows[i].attack_name}`
                }

            }
            var result = [{ "creature_name": rows[0].creature_name, "attack_name": resultTemp }]
            console.log(resultTemp, "resultTemp");
            console.log(result, "result")
            res.json(result);
        })
        .catch((error) => {
            console.log(error)
            res.send(error);
        });
})

router.post('/checkImage', async (req, res) => {
    let creature_name = req.body.creature_name;

    const SQLSTATEMENT = `
    SELECT 
        * 
    FROM 
        card_image
    WHERE 
        creature_name = '${creature_name}'
    `;
    const VALUES = [creature_name];

    connection.promise().query(SQLSTATEMENT, VALUES)
        .then(([rows, fields]) => {
            console.log(rows, 'rows');
            res.json(rows);
        })
        .catch((error) => {
            console.log(error)
            res.send(error);
        });
})


router.get('/gettingToRandomise', async (req, res) => {

    //creatureName , 
    const epicCardDetail = [];
    const CreatureName = connection.promise().query(
        ` SELECT creature_name FROM card_image `
    )
    const hitPoints = connection.promise().query(
        ` SELECT hit_points FROM card `
    )

    Promise.all([CreatureName, hitPoints])
        .then(([CreatureNameResponse, hitPointsResponse]) => {
            const randomNumber = Math.floor(Math.random() * CreatureNameResponse[0].length);
            epicCardDetail.push(CreatureNameResponse[0][randomNumber]);
            //epicCardDetail.push({ "price": 5 });

            //return (CreatureNameResponse[0][randomNumber]);

            const randomRowHP = Math.floor(Math.random() * CreatureNameResponse[0].length);
            const randomNumHP = Math.floor(Math.random() * 9);
            if (randomNumHP % 2 == 0) {
                const randomHP = randomNumHP + hitPointsResponse[0][randomRowHP].hit_points;
                epicCardDetail.push({ "hit_points": randomHP });
            }
            else if (randomNumHP % 3 == 0) {
                const randomHP = randomNumHP * hitPointsResponse[0][randomRowHP].hit_points;
                epicCardDetail.push({ "hit_points": randomHP });
            }
            else {
                const randomHP = randomNumHP + hitPointsResponse[0][randomRowHP].hit_points + 10;
                epicCardDetail.push({ "hit_points": randomHP });
            }

            const randomPrice = Math.ceil(Math.random() * 10);
            epicCardDetail.push({ "price": randomPrice });

            const randomLevel = Math.ceil(Math.random() * 20);
            epicCardDetail.push({ "creature_level": randomLevel });

            console.log(epicCardDetail);
            res.send(epicCardDetail);

        })
        .catch((error) => {
            console.log(error);
            res.send(error);
        })


    /*
            // const requestPromises = [];
        
            // requestPromises.push(
            //     connection.promise().query(
            //         `
            //         SELECT creature_name FROM card_image
            //         `
            //     )
            //         .then((rows) => {
            //             //console.log(rows);
            //             const randomNumber = Math.floor(Math.random() * rows[0].length);
            //             return (rows[0][randomNumber]);
            //         })
            //         .catch((error) => {
            //             console.log(error);
            //             throw (error);
            //         })
            // )
        
            // requestPromises.push( 
            //     connection.promise().query ( 
            //         `
            //         SELECT hit_points FROM card 
            //         `
            //     )
            //         .then((rows) )
            // )
        
            // try {
            //     const results = await Promise.all(requestPromises);
            //     console.log("promise.all gettingToRandomise");
            //     res.json(results);
            // }
            // catch (error) {
            //     res.status(500).json(error);
            // }
    */

})

router.post('/insertRandomCard', (req, res, next) => {
    let creature_name = req.body.creature_name;
    let hit_points = req.body.hit_points;
    let price = req.body.price;
    let creature_level = req.body.creature_level;
    let month = req.body.month;
    let year = req.body.year;
    let luckyNumber = req.body.luckyNumber;

    const SQLSTATEMENT = `
    INSERT INTO epicCardsSu (creature_name, hit_points, price, creature_level, month, year, luckyNumber)
    VALUES('${creature_name}', ${hit_points}, ${price}, ${creature_level}, ${month}, ${year}, ${luckyNumber}) 
    `;
    const VALUES = [creature_name, hit_points, price, creature_level, month, year, luckyNumber];

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

router.delete('/deleteDuplicateRECard', (req, res, next) => {
    let month = req.body.month;
    let year = req.body.year;

    const SQLSTATEMENT = `
    DELETE t1
    FROM epicCardsSu t1
    JOIN epicCardsSu t2 
      ON t1.month = t2.month AND t1.year = t2.year
    WHERE t1.card_id > t2.card_id AND t1.month = ${month} AND t1.year = ${year};
    
    `;
    const VALUES = [month, year];

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

router.post('/insertToLink/:playerID', (req, res, next) => {
    let playerID = req.params.playerID;
    let epicCardID = req.body.epicCardID;

    const SQLSTATEMENT = `
    INSERT INTO ecPlayerLink (epicCardID, playerID)
    VALUES('${epicCardID}', ${playerID}) 
    `;
    const VALUES = [epicCardID, playerID];

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

router.delete('/deleteDuplicateInLink/:playerID', (req, res, next) => {
    let playerID = req.params.playerID;

    const SQLSTATEMENT = `
    DELETE t1
    FROM ecPlayerLink t1
    JOIN ecPlayerLink t2 
      ON t1.playerID = t2.playerID
    WHERE t1.tempLinkID > t2.tempLinkID AND t1.playerID = ${playerID}
    
    `;
    const VALUES = [playerID];

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

router.post('/insertIntoCardTable', (req, res, next) => {
    let creature_name = req.body.creature_name;
    let hit_points = req.body.hit_points;
    let price = req.body.price;
    let creature_level = req.body.creature_level

    const SQLSTATEMENT = `
    INSERT INTO card (creature_name, hit_points, price, creature_level)
    VALUES('${creature_name}', ${hit_points}, ${price}, ${creature_level}) 
    `;
    const VALUES = [creature_name, hit_points, price, creature_level];

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

router.delete('/deleteDuplicateInCardTable/:cardID', (req, res, next) => {
    let cardID = req.params.cardID;

    const SQLSTATEMENT = `
    DELETE FROM card WHERE card_id = ${cardID} 
    `;
    const VALUES = [cardID];

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

router.post('/insertIntoCardCollectionTable/:playerID', (req, res, next) => {
    let playerID = req.params.playerID;
    let cardID = req.body.cardID;

    const SQLSTATEMENT = `
    INSERT INTO card_collection (player_id, card_id)
    VALUES('${playerID}', ${cardID}) 
    `;
    const VALUES = [playerID, cardID];

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

router.delete('/deleteDuplicateInCardCollectionTable/:cardID', (req, res, next) => {
    let cardID = req.params.cardID;

    const SQLSTATEMENT = `
    DELETE FROM card_collection WHERE card_id = ${cardID} 
    `;
    const VALUES = [cardID];

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

router.post('/getPlayerWhoWinInfo', async (req, res) => {
    let epicCardID = req.body.epicCardID;

    const SQLSTATEMENT = `
    SELECT
        *
    FROM 
        ecPlayerLink link, player p, player_avatar pa
    WHERE
        link.playerID = p.player_id AND p.image_id = pa.image_id AND link.epicCardID = ${epicCardID}
    `;
    const VALUES = [epicCardID];

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

router.post('/checkWinOrNotInLink/:playerID', async (req, res) => {
    let playerID = req.params.playerID;
    let epicCardID = req.body.epicCardID;

    const SQLSTATEMENT = `
    SELECT
        *
    FROM 
        ecPlayerLink link
    WHERE
        link.playerID = ${playerID} AND link.epicCardID = ${epicCardID}
    `;
    const VALUES = [playerID, epicCardID];

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