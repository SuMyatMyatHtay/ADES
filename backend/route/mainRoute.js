const express = require("express");
const router = express.Router();

//Su
const friendsRoute = require("./friendsRoute");
const searchRoute = require("./searchRoute");
const tradingRoute = require("./tradingRoute");
const cardRoute = require("./cardRoute");
const friendReqRoute = require("./friendReqRoute");
const suTransitionRoute = require("./suTransitionRoute");
const blackRoomRoute = require("./blackRoomRoute");
const blackRoomRandomRoute = require("./blackRoomRandomRoute");

console.log("THis is main route")


router.use("/friendsRoute", friendsRoute);
router.use("/searchRoute", searchRoute);
router.use("/tradingRoute", tradingRoute);
router.use("/cardRoute", cardRoute);
router.use("/friendReqRoute", friendReqRoute);
router.use("/suTransitionRoute", suTransitionRoute);
router.use("/blackRoomRoute", blackRoomRoute);
router.use("/blackRoomRandomRoute", blackRoomRandomRoute);


//edlin
const EdlinRoute = require("./user")
const adversaryRoute = require("./adversary")
const battlePointsRoute = require("./battlePoints")

const playURoute = require("./PlayURoute")

//post routers for the players and adversaries
router.use("/userRoute", EdlinRoute);
router.use("/adversaryRoute", adversaryRoute);
router.use("/battlePointsRoute", battlePointsRoute);
router.use("/PlayURoute", playURoute);

//Minrui
const playersRoute = require("./playersRoute")
const roomsRoute = require('./roomsRoute')
const clanRequest = require("./clanRequestRoute")
const chatRoute = require('./chatRoute')
const clanDetails = require('./clanDetails')
const rpsRoute = require('./rpsRoute')
const shopRoute = require('./hiveRoute')
router.use("/rooms", roomsRoute)
router.use("/players", playersRoute)
router.use("/chat", chatRoute)
router.use("/clanDetails", clanDetails)
router.use("/rps", rpsRoute)
router.use("/clanRequest", clanRequest)
router.use("/hive", shopRoute)


//Ei Kyar Phyu
const clanpointRoute = require('./clanpointRoute');
const clanlistAndclanInformationRoute = require("./clanlistAndclanInformationRoute");
const freeGiftCardRoute = require("./freeGiftCardRoute");


router.use("/clanPoint", clanpointRoute);
router.use('/clanDetails', clanlistAndclanInformationRoute);
router.use('/freeGiftCard', freeGiftCardRoute);



//Thiha
const cardCollectionRoute = require('./cardCollectionRoute');
const buyCardsRoute = require("./buyCardsRoute");
router.use('/buyCards', buyCardsRoute)
router.use('/cardCollection', cardCollectionRoute)

router.get("/player", (req, res, next) => {
    res.send("main")
})


console.log("This is main route")
module.exports = router;
