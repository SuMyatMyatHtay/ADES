var jwt = require('jsonwebtoken');
var config = require('./config');
const { head } = require('./app');
//----------
//functions
//----------
function verifyToken(req, res, next) {
    //retrieve authorization header’s content
    //Authorisation: Bearer <token>
    var token = req.headers['authorisation'];
    //process token
    if (!token || !token.includes('Bearer')) {
        let errorMesssage = {
            auth: 'false',
            message: 'Not authorized!'
        }
        return res.status(401).type('json').send(errorMesssage);
    }

    else {
        token = token.split('Bearer ')[1];
        jwt.verify(token, config.key, function (err, decodedPayLoad) {//verify token
            if (err) {
                var json = { auth: false, message: 'Not authorized!' }

                return res.status(403).type('JSON').send(JSON.stringify(json)).end();
            } else {
                req.payload = {
                    "player_id": decodedPayLoad.player_id,
                    "player_username": decodedPayLoad.player_username,
                    timestamp: new Date()
                }
                next(); //move on
            }

        });
    }
}

//----------
//exports
//----------

module.exports = verifyToken;

