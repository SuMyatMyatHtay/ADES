const express = require("express");
const router = express.Router();
const connection = require('../db'); //Import from db.js

let monsters=[]

router.post("/gacha",function(req,res,next){
    let noOfCards=parseInt(req.body.noOfCards)
    let playerID=parseInt(req.body.playerID)
    let price=parseInt(req.body.price)
    connection.promise().query(`
        select gold
        from player
        where player_id=${playerID}
        `)
        
    
    .then(([rows,fields])=>{
            
        if(parseInt(rows[0]["gold"])-price<0){
            res.status(400)
        }
        else{
            return connection.promise().query(`
            update player
            set gold=gold-${price}
            where player_id=${playerID}
            `)
            
            
        }
    })
    .then(()=>{
        return connection.promise().query(`
        select creature_name,health
        from card_image`)
         
    })
    .then(([rows,field])=>{
            for (let index = 0; index < rows.length; index++) {
                monsters.push(rows[index])
            }
        })
    .then(()=>{     
        let allPromise=[]
        for (let index = 0; index < noOfCards; index++) {
            let i=monsters[Math.round(Math.random()*(monsters.length-1))]
            let cardSql=`
            insert into
            card (creature_name,hit_points,price,creature_level)
            values ('${i['creature_name']}',${i['health']},2,1)`
            
            allPromise.push(connection.promise().query(cardSql)
            .then((response)=>{
                return connection.promise().query(`
                insert into
                card_collection
                values (${playerID},${response[0]["insertId"]})`)
            })
            .catch((error)=>{
                res.send(error)
            })
            )
        }
        return Promise.all(allPromise)
    })
    .then(()=>{
        return connection.promise().query(`
        select card_id
        from card_collection
        where player_id=${playerID}
        order by card_id desc
        limit ${noOfCards}`)
    })
    .then(([rows,fields])=>{
        let cardIdArray=[]
        for (let index = 0; index < rows.length; index++) {
            cardIdArray.push(rows[index]["card_id"])
            
        }
        return connection.promise().query(`
        select c.creature_name,c.hit_points,c.price,c.creature_level,ca.attack_name,a.attack_damage,ci.card_image,c.card_id
        from card as c,card_attack as ca,attack as a,card_image as ci
        where c.card_id in (${cardIdArray}) and ca.creature_name=c.creature_name and a.attack_name=ca.attack_name and c.creature_name=ci.creature_name`)
    })
    .then(([rows,fields])=>{
        //remove duplicates
        for (let i = 0; i < rows.length; i++) {
            if (rows[i]) {
                rows[i]['attack'] = [{"attack_name":rows[i]['attack_name'],
            "attack_damage":rows[i]['attack_damage']}]
            }
            for (let j = i + 1; j < rows.length; j++) {
                if (rows[i]['card_id'] == rows[j]['card_id']) {
                    rows[i]['attack'].push({"attack_name":rows[j]['attack_name'],
                    "attack_damage":rows[j]['attack_damage']})
                    rows.splice(j, 1)
                }
            }
            delete rows[i]['attack_name']
            delete rows[i]['attack_damage']

        }
        res.send(rows)
    })
    .catch((error)=>{
        res.send(error)
    })
    
})
module.exports = router