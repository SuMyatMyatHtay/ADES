
const express = require('express');
const router = express.Router();
const cors = require('cors');
const config = require('../config')
const bodyParser = require("body-parser");
let jwt = require('jsonwebtoken');
const urlencodedParser = bodyParser.urlencoded({ extended: false })

router.use(bodyParser.json());
router.use(urlencodedParser);
router.use(cors());

const connection = require('../db'); //Import from db.js

//get all player's friends
router.get("/getAllFriends/:player_id", async (req, res, next) => {
    const player_id = parseInt(req.params.player_id);
    let data = [player_id, player_id,player_id, player_id]
    const sql = `select f.* from friendshipRelation f where f.PlayerID_Send = ? OR f.PlayerID_Accept = ? 
    order by (
      select max(time_stamp)
      from chat_messages
      where receiver_id in (?, f.PlayerID_Accept)
        and sender_id in (?, f.PlayerID_Send)
    )  desc;
    `;
    connection.promise().query(sql, data)
        .then((result) => {
            console.log(result[0]);
            res.send(result[0]);
            return;
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
            return;
        });


});

//get messages between player and friend
router.get("/getMessages/:receiver_id/:sender_id", async (req, res, next) => {
    const receiver_id = req.params.receiver_id;
    const sender_id = req.params.sender_id;
    var data = [receiver_id, sender_id, receiver_id, sender_id]
    const sql = `SELECT *,TIME(time_stamp) AS converted_time  FROM chat_messages where receiver_id in(?,?) and sender_id in (?,?) order by time_stamp asc;`;
    connection.promise().query(sql, data)
        .then((result) => {
            console.log(result[0]);
            res.send(result[0]);
            return;
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
            return;
        });


})

//update message status to read if message is read
router.put("/updateStatus/:messageid", async (req, res, next) => {
    let message_id = req.params.messageid;
    const data = ['read', message_id]
    const sql = `UPDATE chat_messages SET status=? WHERE message_id=?`;
    connection.promise().query(sql, data)
        .then((result) => {
            console.log(result[0]);
            res.send(result[0]);
            return;
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
            return;
        });
})

//send message
router.post("/sendMessage/:sender_id/:receiver_id", async (req, res, next) => {
    let getData;
    let sqlStatement;
    let edit = req.body.edit;
    if(edit==null){
        edit=0
    }
    let receiver_id = req.params.receiver_id;
    let sender_id = req.params.sender_id;
    let message_id = req.body.message_id;
    let message = req.body.message;
    let time_stamp = req.body.time_stamp;
    let last_updated = req.body.last_updated
    time_stamp = new Date(time_stamp)
    const year = time_stamp.getFullYear();
    const month = ('0' + (time_stamp.getMonth() + 1)).slice(-2);
    const day = ('0' + time_stamp.getDate()).slice(-2);
    const hours = ('0' + time_stamp.getHours()).slice(-2);
    const minutes = ('0' + time_stamp.getMinutes()).slice(-2);
    const seconds = ('0' + time_stamp.getSeconds()).slice(-2);
    time_stamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    last_updated = new Date(last_updated)
    const year2 = last_updated.getFullYear();
    const month2 = ('0' + (last_updated.getMonth() + 1)).slice(-2);
    const day2 = ('0' + last_updated.getDate()).slice(-2);
    const hours2 = ('0' + last_updated.getHours()).slice(-2);
    const minutes2 = ('0' + last_updated.getMinutes()).slice(-2);
    const seconds2 = ('0' + last_updated.getSeconds()).slice(-2);
    last_updated = `${year2}-${month2}-${day2} ${hours2}:${minutes2}:${seconds2}`;
    if (message_id != null) {
        console.log('here');
        getData = [message_id,receiver_id, sender_id, message, time_stamp, last_updated,edit]
        sqlStatement = `INSERT into chat_messages (message_id,receiver_id,sender_id,message,time_stamp,last_updated,edit) values(?,?,?,?,?,?,?)`
    }
    else {
        getData = [receiver_id, sender_id, message, time_stamp, last_updated]
        sqlStatement = `INSERT into chat_messages (receiver_id,sender_id,message,time_stamp,last_updated) values(?,?,?,?,?)`;
    }
    const data = getData
    const sql = sqlStatement;
    connection.promise().query(sql, data)
        .then((result) => {

            res.send(result);
            return;
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
            return;
        });
})

//get all data from database
router.get("/getAllMessages", async (req, res, next) => {
    const sql = `SELECT * from chat_messages;`;
    connection.promise().query(sql)
        .then((result) => {
            console.log(result[0]);
            res.send(result[0]);
            return;
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
            return;
        });


});

//delete message
router.delete("/deleteMessages/:message_id", async (req, res, next) => {
    const message_id = req.params.message_id
    const sql = `DELETE from chat_messages where message_id=?;`;
    connection.promise().query(sql, message_id)
        .then((result) => {
            console.log(result);
            res.send(result);
            return;
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
            return;
        });


});

//get message by message id
router.get("/getMessageFromId/:message_id", async (req, res, next) => {
    const message_id = parseInt(req.params.message_id);
    const sql = `SELECT *,TIME(time_stamp) AS converted_time  FROM chat_messages where message_id=?;`;
    connection.promise().query(sql, message_id)
        .then((result) => {
            console.log(result[0][0]);
            res.send(result[0][0]);
            return;
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
            return;
        });


})

//update message if edited
router.put("/updateMessage/:message_id", async (req, res, next) => {
    let message_id = req.params.message_id;
    let message = req.body.message;
    let edit =1;
    var last_updated=req.body.last_updated;
    last_updated = new Date(last_updated)
    const year2 = last_updated.getFullYear();
    const month2 = ('0' + (last_updated.getMonth() + 1)).slice(-2);
    const day2 = ('0' + last_updated.getDate()).slice(-2);
    const hours2 = ('0' + last_updated.getHours()).slice(-2);
    const minutes2 = ('0' + last_updated.getMinutes()).slice(-2);
    const seconds2 = ('0' + last_updated.getSeconds()).slice(-2);
    last_updated = `${year2}-${month2}-${day2} ${hours2}:${minutes2}:${seconds2}`;
    const data=[message,last_updated,edit,message_id]
    const sql = `UPDATE chat_messages SET message=?,last_updated=?,edit=? WHERE message_id=?`;
    connection.promise().query(sql, data)
        .then((result) => {
            console.log(result[0]);
            res.send(result[0]);
            return;
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
            return;
        });
})

//no of unread message
router.get("/getNoOfUnreadMessage/:player_id", async (req, res, next) => {
    const player_id = parseInt(req.params.player_id);
    const sql = `select count(status) no_unread from chat_messages where status='unread' and receiver_id=? group by message_id`;
    connection.promise().query(sql, player_id)
        .then((result) => {
            console.log(result[0][0]);
            res.send(result[0][0]);
            return;
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
            return;
        });


})


module.exports = router;
