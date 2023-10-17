


//////////////////////////////////////////////////////
// INCLUDES
//////////////////////////////////////////////////////
const http = require('http')
const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');
const connection = require('./db'); //Import from db.js
const mainRoute = require('./route/mainRoute')
const verifyToken = require('./verifyToken');
const { JsonWebTokenError } = require('jsonwebtoken');
const path = require('path');
//////////////////////////////////////////////////////
// INIT
//////////////////////////////////////////////////////

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = process.env.PORT || 3000;

//////////////////////////////////////////////////////
// SETUP APP
//////////////////////////////////////////////////////
app.use(cors());
app.use(express.json());
app.use('/', express.static('../frontend-react/build'))
app.use('/legacy', express.static('../frontend'))
app.use(express.static(path.join(__dirname, '../frontend-react/build')));

app.use('/api', mainRoute)




// REQUIRED TO READ POST>BODY
// If not req.body is empty
app.use(express.urlencoded({ extended: false }));

//Testing the database connection 
app.get('/databaseCheck', async (req, res, next) => {
    try {
        console.log(req.query);
        const allMessage = await connection.promise().query("SELECT * FROM friendshipRelation");
        res.json(allMessage[0]);
    }
    catch (error) {
        console.error(error);
        res.send(error);
    }
})
app.get('/api', function (req, res) {
    res.send(`The server is up and running`)
    res.end()
})


app.post("/verifyToken", verifyToken, (req, res) => {
    let jsonData = {
        status: 1,
        message: "success",
    };
    res.status(200).type('json').send(jsonData).end();
    return;
});


wss.on('connection', (ws) => {
    console.log('WebSocket connection established');

    // Event listener for received WebSocket messages
    ws.on('message', (message) => {
        console.log('Received message:', message);

        // Process the received message and send a response if needed
        ws.send('Server response: ' + message);
    });

    // Event listener for WebSocket connection close
    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });
});
wss.on('error', (error) => {
    console.error('WebSocket server error:', error);
  });

//////////////////////////////////////////////////////
// FOR SINGLE PAGE APPLICATION
//////////////////////////////////////////////////////
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '../frontend-react/build', 'index.html'));
});






module.exports = app;
