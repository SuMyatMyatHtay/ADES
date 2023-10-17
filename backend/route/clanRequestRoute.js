const express = require("express");
const router = express.Router();
const connection = require('../db'); //Import from db.js

router.post('/joinClan',function(req,res,next){
    let player_id=req.body.player_id
    let clan_id=req.body.clan_id
    let sql=`
    select *
    from clanmates
    where player_id=${player_id}`
    connection.promise().query(sql)
    .then(([rows,fields])=>{
        console.log(rows);
        if(rows.length>=4){
            res.status(404)
            res.end()
        }
        else{
            let sql=`select *
            from clanmates
            where player_id=${player_id} and ClanID=${clan_id}`
            return connection.promise().query(sql)
        }
    })
    
    
    .then(([rows,fields])=>{
        if(rows.length==0){
            let sql=`
            insert into clanmates (ClanID,player_id,PlayerRole)
            values (${clan_id},${player_id},"member")`
            return connection.promise().query(sql)
        }
        else{
            res.status(403)
            res.end()
        }
    })
    .then(()=>{
        res.end();
    })
    .catch((error)=>{
        if(!(res.statusCode==404 || res.statusCode==403)){
            res.send(error)
        }
    })
})

router.get('/searchClan/:param',function(req,res,next){
    sql=`select ClanID,ClanName
    from clan
    where ClanName like "%${req.params.param}%"`
    connection.promise().query(sql)
    .then(([rows,fields])=>{
        res.send(rows)
    })
    .catch((error)=>{
        res.send(error)
    })
})

module.exports = router;