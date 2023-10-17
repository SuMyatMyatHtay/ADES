const express = require("express");
const router = express.Router();
const connection = require('../db'); //Import from db.js
const { route } = require("./searchRoute");
console.log("This is card route");

router.get('/:cardid', (req, res, next) => {
    console.log(req.params);
    let cardID = req.params.cardid;

    const SQLSTATEMENT = `
            SELECT 
                card.card_id, card.creature_name ,card_attack.attack_name, attack.attack_damage, card.hit_points, card_image.card_image
            FROM 
                card
            
            INNER
				JOIN card_attack on card_attack.creature_name=card.creature_name
            INNER 
                JOIN attack on card_attack.attack_name = attack.attack_name
            INNER 
                JOIN card_image on card_image.creature_name = card.creature_name
            WHERE 
                card.card_id = ${cardID};
    
`;
    const VALUES = [cardID];

    connection.promise().query(SQLSTATEMENT, VALUES)
        .then(([rows, fields]) => {
            //querying attacks will have duplicates so i removed duplicates
            rows[0]['attack_name'] = [rows[0]['attack_name']]
            for (let index = 1; index < rows.length; index++) {
                rows[0]['attack_name'].push(rows[index]['attack_name'])

            }
            console.log(rows);
            res.send([rows[0]])
        })
        .catch((error) => {
            console.log(error)
            res.send(error);
        });

})

module.exports = router; 