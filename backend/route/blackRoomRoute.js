const express = require("express");
const router = express.Router();
const connection = require('../db'); //Import from db.js
console.log("This is black room route");

router.post('/check/:playerID', (req, res, next) => {
    let playerID = req.params.playerID;
    let month = req.body.month;
    let year = req.body.year;


    console.log(req.params);

    const SQLSTATEMENT = `
    SELECT * FROM blackRoom WHERE playerID = ${playerID} AND Month = ${month} AND Year = ${year}
    `;
    const VALUES = [playerID, month, year];

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

router.post('/FirstTimeEntryInsert/:playerID', (req, res, next) => {
    let playerID = req.params.playerID;
    let rToken = req.body.receivedToken;
    let month = req.body.month;
    let year = req.body.year;

    //console.log(PlayerID, FriendID, toBeMine, toBeTheirs)

    const SQLSTATEMENT = `
    INSERT INTO blackRoom (playerID, receivedToken, Month, Year)
    VALUES (${playerID}, ${rToken}, ${month}, ${year}) 
    `;
    const VALUES = [playerID, rToken, month, year];

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

//now using /check because they are the same. So, this is no longer in use
router.post('/getMaxToken/:playerID', (req, res, next) => {
    let playerID = req.params.playerID;
    let month = req.body.month;
    let year = req.body.year;

    const SQLSTATEMENT = `
    SELECT * 
    FROM blackRoom 
    WHERE playerID = ${playerID} AND Month = ${month} AND Year = ${year}
    `;
    const VALUES = [playerID, month, year];

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

router.post('/playerInfoBasic/:playerID', (req, res, next) => {
    let playerID = req.params.playerID;

    const SQLSTATEMENT = `
    SELECT * FROM player WHERE player_id = ${playerID}
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

router.post('/playerAvatar/:playerID', (req, res, next) => {
    let playerID = req.params.playerID;

    const SQLSTATEMENT = `
    SELECT * FROM player p, player_avatar pa WHERE p.image_id = pa.image_id AND p.player_id = ${playerID}
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


router.put('/useGold/:playerID', (req, res, next) => {
    let playerID = req.params.playerID;
    let gold = req.body.gold;

    const SQLSTATEMENT = `
    UPDATE player SET gold = ${gold} WHERE player_id = ${playerID}
    `;
    const VALUES = [gold, playerID];

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

router.put('/setBet/:playerID', (req, res, next) => {
    let playerID = req.params.playerID;
    let month = req.body.month;
    let year = req.body.year;
    let betToken = req.body.betToken;

    const SQLSTATEMENT = `
    UPDATE blackRoom SET betToken = ${betToken} WHERE playerID = ${playerID} AND Month = ${month} AND Year = ${year}; 
    `;
    const VALUES = [betToken, playerID, month, year];

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

router.put('/updateCollectCheck/:playerID', (req, res, next) => {
    let playerID = req.params.playerID;
    let month = req.body.month;
    let year = req.body.year;

    const SQLSTATEMENT = `
    UPDATE blackRoom SET collectCheck = 1 WHERE playerID = ${playerID} AND Month = ${month} AND Year = ${year}; 
    `;
    const VALUES = [playerID, month, year];

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

router.delete('/autoDeleteDuplicate/:playerID', (req, res, next) => {
    let playerID = req.params.playerID;

    const SQLSTATEMENT = `
    DELETE t1
    FROM blackRoom t1
    JOIN blackRoom t2 
      ON t1.playerID = t2.playerID AND t1.Month = t2.Month AND t1.Year = t2.Year
    WHERE t1.brID > t2.brID AND t1.playerID = ${playerID};
    
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


module.exports = router;