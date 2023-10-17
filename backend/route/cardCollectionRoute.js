const express = require("express");
const router = express.Router();
const connection = require('../db'); //Import from db.js

//get no of cards
router.post('/numofcards',function(req,res,next){
    const player_id = req.body.playerID
    const sql=`
    select player_id,count(card_id) as no_of_cards
    from card_collection
    where player_id=${player_id}
    group by player_id`
    connection.promise().query(sql)
    .then(([rows,fields])=>{
        res.send(rows)
    })
    .catch((error)=>{
        res.send(error)
    })
})
//get all cards
router.post('/cardCollection', function (req, res, next) {
    const player_id = req.body.playerID
    const sql = `
    select
    c.creature_name,c.hit_points,c.price,c.creature_level,ca.attack_name,a.attack_damage,ci.card_image,c.card_id
    from
    card as c,card_collection as cc,card_attack as ca,attack as a,card_image as ci
    where
    cc.card_id=c.card_id and ca.creature_name=c.creature_name and a.attack_name=ca.attack_name and c.creature_name=ci.creature_name and cc.player_id=${player_id}
    order by c.card_id asc
    `

    connection.promise().query(sql)
    .then(([rows, fields]) => {
        //removing duplicate rows
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
        res.json(rows);
    })
        .catch((error) => {
            console.log(error)
            res.send(error);
        });
})

router.put('/upgradeCards',function(req,res,next){
    const card_id=req.body.cardID
    const player_id=req.body.playerID
    const price=req.body.price
    connection.promise().query(`
        select gold
        from player
        where player_id=${player_id}
        `)
        .then(([rows,fields])=>{
            
            if(parseInt(rows[0]["gold"])-price<0){
                res.send('not enough gold')
            }
            else{
                let sql=`
                update player
                set gold=gold-${price}
                where player_id=${player_id}`
                return connection.promise().query(sql)
            }
        })
    
    .then(()=>{
        return connection.promise().query(`
        select ci.upgrade_multiplier
        from card as c,card_image as ci
        where c.creature_name=ci.creature_name and c.card_id=${card_id}
        `)
    })
    .then(([rows,fields])=>{
        let upgrade_multiplier=rows[0]['upgrade_multiplier']
        return connection.promise().query(`
        update card
        set hit_points=hit_points+${Math.round(Math.random()*10)},price=price+${Math.round(Math.random()*5)},creature_level=creature_level+1
        where card_id=${card_id}`)
        .then((response)=>{
            res.send(response)
        })
    })
    .catch((error)=>{
        res.json(error)
    })
    
})

router.get('/showCardPrice/:card_id',function(req,res,next){
    let card_id=req.params.card_id
    connection.promise().query(`
    select price
    from card
    where card_id=${card_id}`)
    .then(([rows,fields])=>{
        res.json(rows[0]['price'])
    })
})

router.post("/sellCards",function(req,res,next){
    let card_id=req.body.cardID
    let player_id=req.body.playerID
    let getPriceSql=`
    select
    price
    from
    card
    where
    card_id=${card_id}`
    connection.promise().query(getPriceSql)
    .then(([rows,fields])=>{
        return connection.promise().query(`update 
        player 
        set gold=gold+${rows[0]["price"]}
        where
        player_id=${player_id};
        `)

    })
    .then((price)=>{
        return connection.promise().query(`
        delete from card
        where card_id=${card_id}`)
    })
    .then(()=>{
        return connection.promise().query(`
        delete from card_collection
        where card_id=${card_id}`)
    })
    .then((response)=>{
        res.send(response)
    })
    .catch((error)=>{
        res.send(error)
    })
})

router.post('/showCard/:cardid',function(req,res,next){
    let player_id=parseInt(req.body.playerID)
    let card_id=parseInt(req.params.cardid)
    let sql=`
    select *
    from card_collection
    where card_id=${card_id} and player_id=${player_id}`
    connection.promise().query(sql)
    .then(([rows,field])=>{
        if(rows.length==0){
            res.status(404).end()
        }
        else{
            let sql=`
    select c.creature_name,c.hit_points,c.price,c.creature_level,ca.attack_name,a.attack_damage,ci.card_image,c.card_id
    from card as c,card_attack as ca,attack as a,card_image as ci
    where c.card_id=${card_id} and ca.creature_name=c.creature_name and a.attack_name=ca.attack_name and c.creature_name=ci.creature_name`
    return connection.promise().query(sql)
    .then(([rows, fields]) => {
        //removing duplicate rows
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
        res.json(rows);
    })
        .catch((error) => {
            console.log(error)
            res.send(error);
        });
        }
    })
    
    
})

router.post('/displayGold',function(req,res,next){
    let player_id=req.body.playerID
    sql=`

    select gold
    from player
    where player_id=${player_id}`
    connection.promise().query(sql)
    .then(([rows,field])=>{
        res.json(rows)
    })
    .catch((error)=>{
        console.log(error);
    })
})
module.exports = router