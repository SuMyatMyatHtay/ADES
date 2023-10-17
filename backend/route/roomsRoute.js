const express = require('express');
const cors = require('cors');
const config = require('../config')
const bodyParser = require("body-parser");
let jwt = require('jsonwebtoken');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const router = express.Router();
router.use(bodyParser.json());
router.use(urlencodedParser);
router.use(cors());
const connection = require('../db'); //Import from db.js



//insert player to the hive table
router.post('/insertToHive', async (req, res, next) => {
    const hiveEntranceCd = req.body.ClanID+''+req.body.player_id;
    const player_id = req.body.player_id;
    const ClanID = req.body.ClanID;
    const data = [hiveEntranceCd,player_id, ClanID]
    const sql = `Insert into TheHive (hiveEntranceCd,player_id,ClanID)values(?,?,?)`;
    connection.promise().query(sql, data)
        .then((result) => {
            console.log(result);
            res.send("Success")
        })
        .catch((error) => {
            if(error.code=="ER_DUP_ENTRY"){
             res.send("Duplicate");
             return;
            }
            console.log("catch");
            console.log(error)
            res.send(error)
            return;
        });


});

//get all players from either the hive or disco cosmo
router.post('/getAllPlayersInRoom/:ClanID', async (req, res, next) => {
    const ClanID = req.params.ClanID;
    const location = req.body.location
    const sql = `Select player_id from ${location} where ClanID=${ClanID}`;
    connection.promise().query(sql, ClanID)
        .then((result) => {
            let dataArray=[]
            console.log(result);
            result[0].forEach((result)=>{
                dataArray.push(result.player_id)
            })
            res.send(dataArray);
            return;
        })
        .catch((error) => {
            console.log("catch");
            console.log(error)
            res.send(error)
            return;
        });


});

//insert player to disco cosmo table
router.post('/insertToDC', async (req, res, next) => {
    const DCEntranceCd = req.body.ClanID+''+req.body.player_id;
    const player_id = req.body.player_id;
    const ClanID = req.body.ClanID;
    const data = [DCEntranceCd,player_id, ClanID]
    const sql = `Insert into DiscoCosmo (DCEntranceCd,player_id,ClanID)values(?,?,?)`;
    connection.promise().query(sql, data)
        .then((result) => {
            console.log(result);
            res.send("Success")
        })
        .catch((error) => {
            if(error.code=="ER_DUP_ENTRY"){
             res.send("Already in the room");
             return;
            }
            console.log("catch");
            console.log(error)
            res.send(error)
            return;
        });


});

router.delete('/deleteFromHive/:hiveEntranceCd',async(req,res,next)=>{
    const hiveEntranceCd = req.params.hiveEntranceCd;
    console.log(hiveEntranceCd)
    const sql = `DELETE from TheHive where hiveEntranceCd=?`;
    connection.promise().query(sql, hiveEntranceCd)
        .then((result) => {
            console.log(result);
            res.send(result);
        })
        .catch((error) => {
           res.send(error);
        });
})

router.delete('/deleteFromHive/:hiveEntranceCd',async(req,res,next)=>{
    const hiveEntranceCd = req.params.hiveEntranceCd;
    console.log(hiveEntranceCd)
    const sql = `DELETE from TheHive where hiveEntranceCd=?`;
    connection.promise().query(sql, hiveEntranceCd)
        .then((result) => {
            console.log(result);
            res.send(result);
        })
        .catch((error) => {
           res.send(error);
        });
})

router.delete('/deleteFromDisco/:DCEntranceCd',async(req,res,next)=>{
    const DCEntranceCd = req.params.DCEntranceCd;
    console.log(DCEntranceCd)
    const sql = `DELETE from DiscoCosmo where DCEntranceCd=?`;
    connection.promise().query(sql, DCEntranceCd)
        .then((result) => {
            console.log(result);
            res.send(result);
        })
        .catch((error) => {
           res.send(error);
        });
})



module.exports = router;