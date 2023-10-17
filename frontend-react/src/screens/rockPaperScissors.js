import '../css/rockPaperScissors.css';
import React, { Component } from 'react';
import Background from '../images/dojo.JPEG'
import axios from 'axios';
import {
  Route,
  useParams,
  Routes,
  BrowserRouter
} from "react-router-dom";
import rock from '../images/rock.png';
import paper from '../images/paper.png';
import scissors from '../images/scissors.png';
import Bolin from '../images/master1.png';
import Aang from '../images/master2.PNG';
import Zuko from '../images/master3.png';
import Cedric from '../images/master4.png'
const API_URL = 'https://monster-cat-world.onrender.com';
var REACT_URL = 'https://monster-cat-world.onrender.com';
const queryParams = new URLSearchParams(window.location.search);
const clan_Name = queryParams.get('Clan_Name');
const player_id = localStorage.getItem('player_id');
let gameActive = false;
var ClanID;
let countTimer;
let socket;

if (window.location.hostname === 'localhost' && window.location.port === '3001') {
  REACT_URL = window.location.protocol + "//" + window.location.hostname + ":" + "3000";
  socket = new WebSocket('ws://localhost:3001'); // Connect to the backend WebSocket server on port 3000
}
else {
  socket = new WebSocket('ws://localhost:3000'); // Connect to the frontend WebSocket server on port 3001
}


//master arr
const masterArr = [
  [Bolin, 'Apprentice Bolin'],
  [Aang, 'Shifu Aang'],
  [Zuko, 'Zen Zuko'],
  [Cedric, 'Socerer Cedric']
]
const RPSarr = [
  "rock", "paper", "scissors"
]



class App extends React.Component {
  constructor() {
    super()
    this.state = {
      socket: null,
      //show selected option
      showChoice: false,
      //show Restart Button
      showRestart: false,
      //show "Rock", "Paper", "Scissors" Options
      showOptions: false,
      //show end result
      showEndCard: false,
      //Top left buttton text
      buttonText: "Back To Village",
      //countdown text
      countdownText: "",
      // id of selected option
      idOfOpt: "",
      //image of selected option by player
      playerImgChoice: "",
      // image of selected option by NPC
      NPCImgChoice: "",
      // id of selected option by NPC
      idOfNPCOpt: "",
      //end card text
      endCardText: "",
      //end card span
      endCardBlock: "",

    }
    this.startScreen = this.startScreen.bind(this);
    this.startGame = this.startGame.bind(this);
    this.getPlayerMaster = this.getPlayerMaster.bind(this);

  }

  componentDidMount() {

    // Event listener for WebSocket connection open
    socket.addEventListener('open', () => {
      console.log('WebSocket connection established');
      // Perform actions or send messages over the WebSocket
    });

    // Event listener for WebSocket errors
    socket.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
      // Handle any WebSocket errors
    });

    // Event listener for WebSocket connection close
    socket.addEventListener('close', () => {
      console.log('WebSocket connection closed');
      // Perform any necessary actions when the connection is closed
    });

    this.startScreen();
    if (player_id == null) {
      window.location.assign(`${REACT_URL}/Clan`)
    }

    //check if player belongs to clan
    axios.post(`${API_URL}/api/clanDetails/getClanID/${clan_Name}`)
      .then((response) => {
        if (response.data.ClanID == null) {
          window.location.assign(`${REACT_URL}/Clan?${player_id}`);
        }
        ClanID = response.data.ClanID;
        axios.get(`${API_URL}/api/clanDetails/checkPlayerFromClan/${ClanID}/${player_id}`)
          .then((result) => {
            //if player not from clan, bye go to clan.html
            if (result.data.length == 0) {
              window.location.assign(`${REACT_URL}/Clan?${player_id}`)
            }

          })
          .catch((error) => {
            console.log(error)
          })

      })
      .catch((error) => {
        console.log(error)
      })
  }

  componentDidUpdate() {

  }

  startScreen() {

    gameActive = false;
    clearInterval(countTimer);
    document.getElementById('playerDiv').innerHTML = ''
    this.setState({
      showCountdown: false,
      showChoice: false,
      showRestart: false,
      showOptions: false,
      showEndCard: false,
      buttonText: "Back To Village",
      countdownText: "",
    })
    //first screen showing instructions
    document.getElementById("screen").innerHTML = `
    <div id="instructions">
    <p>
        Welcome to Rock, Paper, Scissors! You will be competing against our masters.
        When you press enter, there will be buttons: 'Rock','Paper','Scissors'.
        You have 5 seconds to press the button of your choice. Remember Rock wins Scissors,
        Scissors wins Paper and Paper wins Rock. If you win, you will get $5.00 gold and 10 clan points.
        If you lose, your gold will be deducted by $3.00 and clan points will be deducted by 5. If you draw,
        no rewards given. All the best!
    </p>
</div>
<button id="start">Start</button>\
`
    //on click go to startGame()
    document.getElementById("start").onclick = this.startGame;
    //make sure buttonText is Back TO Village (this is if they quit)
    this.setState({ buttonText: "Back To Village" })
    document.getElementById("backQuit").onclick = () => { window.location.assign(`${REACT_URL}/clanVillage?Clan_Name=${clan_Name}`) }
  }


  startGame() {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ message: "Hello" }));
    } else {
      console.log(socket.readyState)
      console.log("WebSocket connection is not open yet.");
    }
    gameActive = true
    clearInterval(countTimer);
    //make sure for restarting of game
    this.setState({
      showCountdown: false,
      showChoice: false,
      showRestart: false,
      showEndCard: false,
      idOfOpt: "",
      playerImgChoice: "",
      countdownText: "",
      NPCImgChoice: "",
      idOfNPCOpt: "",
    })
    //change screen innerHTML
    document.getElementById("screen").innerHTML = `
        <div id="masterDiv">
 
        </div>
        `
    //when game starts, "back to village" ->"Quit"
    this.setState({ buttonText: "Quit" })
    document.getElementById("backQuit").onclick = this.startScreen
    //got to getPlayerMaster()
    this.getPlayerMaster();
    //countdown
    this.count(`Game begins in `, 3, () => {
      if (gameActive == true) {
        this.setState({ showOptions: true, showRestart: false })
      }
      this.count(` s left to pick`, 5, () => {

        if (gameActive == true) {
          this.setState({ showOptions: false })
        }
        if (gameActive == true) {
          //clearInterval once timer is done
          clearInterval(countTimer);
          //randomise player input if they dont choose by countdown
          const randomInput = Math.floor(Math.random() * 3);
          this.rockPaperScissors(RPSarr[randomInput]);
          //restart button to appear 5s later
        }
      })

    }
    )
  };

  getPlayerMaster() {
    const player_id = localStorage.getItem('player_id');
    //this is for getting player avatar
    axios.get(`${API_URL}/api/players/getPlayerInfo/${player_id}`)
      .then((result) => {
        const player_username = result.data.player_username
        axios.get(`${API_URL}/api/players/getPlayerAvatar/${result.data.image_id}`)
          .then((response) => {
            let playerAvatar = response.data.split('./images/')
            document.getElementById("playerDiv").innerHTML = `
            <img src=${require(`../images/` + playerAvatar[1])} id="player" />
            <p id="playerName">${player_username}</p>`;
            //random master avatar
            const masterIndex = Math.floor(Math.random() * 4);
            document.getElementById("masterDiv").innerHTML = `
            <img src="${masterArr[masterIndex][0]}" id="master" />
            <p id="masterName">${masterArr[masterIndex][1]}</p>`
            return
          })
          .catch((error) => {
            console.log(error)
          })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //countdown
  count(message, seconds, callback) {
    this.setState({ showCountdown: true, showRestart: false })
    let countdownNo = seconds
    let count = seconds

    countTimer = setInterval(() => {
      if (count <= 0) {
        clearInterval(countTimer);
        callback();
      }

      count -= 1;
      if (countdownNo == 3) {
        if (gameActive == true) {
          this.setState({ countdownText: message + (count + 1) })
        }
      }
      else {
        if (gameActive == true) {
          this.setState({ countdownText: (count + 1) + message })
        }

      }

    }, 1000)

  }

  //clicked event
  handleClick = (e) => {
    //if the options are clicked
    if (e.target.id == 'rock' || e.target.id == 'paper' || e.target.id == 'scissors') {
      this.rockPaperScissors(e.target.id)
    }

  }

  rockPaperScissors(playerOption) {
    gameActive = false;
    this.setState({
      showChoice: true,
      showOptions: false,
      countdownText: "",
    })
    //clearInterval once clicked one of these options
    clearInterval(countTimer);
    setTimeout(() => {
      if (document.getElementById("instructions") == null) {
        this.setState({
          showRestart: true
        })
      }
    }, 5000)
    //randomise com action
    const RPSindex = Math.floor(Math.random() * 3);
    //if player choose rock
    if (playerOption == 'rock') {
      //get the rock image
      this.setState({
        playerImgChoice: rock,
        idOfOpt: 'rockOpt'
      })
      clearInterval(countTimer);
      //translate towards the com opt image
      var translateValue = `translate3d(250px,0,0)`
      setTimeout(() => {
        document.getElementById('rockOpt').style.transform = translateValue;
      }, 500)

      //just the if else statement based on players' choice
      //update clan points and gold based on lose or win or tie
      //also update the statistic for this game
      if (RPSarr[RPSindex] == 'scissors') {
        this.setState({
          NPCImgChoice: scissors,
          idOfNPCOpt: "scissorsImg",
          showEndCard: true,
          endCardText: `You Won!!!`,
          endCardBlock: `+$5.00 gold &  10 clan points`
        })
        clearInterval(countTimer);
        this.updateGold(5.00);
        this.updateClanPoints(10);
        this.updateRPSstat('rock', 'scissors', 10, 5.00);
        //translate towards player's rock image
        var translateValue2 = `translate3d(-250px,0,0)`;
        setTimeout(() => {
          document.getElementById('scissorsImg').style.transform = translateValue2;
          //make the scissors "fly" haha since it lost
          setTimeout(() => {
            document.getElementById('scissorsImg').style.transform = `rotate(180deg)`;
            document.getElementById('scissorsImg').style.transform += `translate3d(-500px,0,0)`;
          }, 500)
        }, 500)
      }
      else if (RPSarr[RPSindex] == 'paper') {
        this.setState({
          NPCImgChoice: paper,
          idOfNPCOpt: "paperImg",
          showEndCard: true,
          endCardText: `You lose!!!`,
          endCardBlock: `-$3.00 gold &  -5 clan points`
        })
        clearInterval(countTimer);
        this.updateGold(-3.00);
        this.updateClanPoints(-5);
        this.updateRPSstat('rock', 'paper', -5, -3.00);
        //translate towards player's rock image
        var translateValue2 = `translate3d(-250px,0,0)`;
        setTimeout(() => {
          document.getElementById('paperImg').style.transform = translateValue2;
          //make the rock "fly" haha since it lost
          setTimeout(() => {
            document.getElementById('rockOpt').style.transform = `rotate(250deg)`;
            document.getElementById('rockOpt').style.transform += `translate3d(400px,0,0)`;
          }, 500)
        }, 500)
      }
      else if (RPSarr[RPSindex] == 'rock') {
        this.setState({
          NPCImgChoice: rock,
          idOfNPCOpt: "rockImg",
          showEndCard: true,
          endCardText: `It's a tie!!!`,
          endCardBlock: `No gold & no clan points`
        })
        this.updateRPSstat('rock', 'rock', 0, 0.00);
        var translateValue2 = `translate3d(-250px,0,0)`;
        setTimeout(() => {
          document.getElementById('rockImg').style.transform = translateValue2;
        }, 500)
      }
    }
    //it's simlar to the prev
    else if (playerOption == 'paper') {
      this.setState({
        playerImgChoice: paper,
        idOfOpt: "paperOpt"
      })

      var translateValue = `translate3d(250px,0,0)`;
      setTimeout(() => {
        document.getElementById('paperOpt').style.transform = translateValue;
      }, 500)
      if (RPSarr[RPSindex] == 'rock') {
        this.setState({
          NPCImgChoice: rock,
          idOfNPCOpt: "rockImg",
          showEndCard: true,
          endCardText: `You Won!!!`,
          endCardBlock: `+$5.00 gold &  10 clan points`
        })
        var translateValue2 = `translate3d(-250px,0,0)`;
        this.updateGold(5.00);
        this.updateClanPoints(10)
        this.updateRPSstat('paper', 'rock', 10, 5.00);
        setTimeout(() => {
          document.getElementById('rockImg').style.transform = translateValue2;
          setTimeout(() => {
            document.getElementById('rockImg').style.transform = `rotate(180deg)`;
            document.getElementById('rockImg').style.transform += `translate3d(-500px,0,0)`;
          }, 500)
        }, 500)
      }
      else if (RPSarr[RPSindex] == 'scissors') {
        this.setState({
          NPCImgChoice: scissors,
          idOfNPCOpt: "scissorsImg",
          showEndCard: true,
          endCardText: `You lose!!!`,
          endCardBlock: `-$3.00 gold &  -5 clan points`
        })
        this.updateGold(-3.00);
        this.updateClanPoints(-5)
        this.updateRPSstat('paper', 'scissors', -5, -3.00);
        var translateValue2 = `translate3d(-250px,0,0)`;
        setTimeout(() => {
          document.getElementById('scissorsImg').style.transform = translateValue2;
          setTimeout(() => {
            document.getElementById('paperOpt').style.transform = `rotate(180deg)`;
            document.getElementById('paperOpt').style.transform += `translate3d(500px,0,0)`;
          }, 500)
        }, 500)
      }
      else if (RPSarr[RPSindex] == 'paper') {
        this.setState({
          NPCImgChoice: paper,
          idOfNPCOpt: "paperImg",
          showEndCard: true,
          endCardText: `It's a tie!!!`,
          endCardBlock: `No gold & no clan points`
        })
        clearInterval(countTimer);
        var translateValue2 = `translate3d(-250px,0,0)`;
        this.updateRPSstat('paper', 'paper', 0, 0.00);
        setTimeout(() => {
          document.getElementById('paperImg').style.transform = translateValue2;
        }, 500)
      }
    }
    else if (playerOption == 'scissors') {
      this.setState({
        playerImgChoice: scissors,
        idOfOpt: "scissorsOpt"
      })

      var translateValue = `translate3d(250px,0,0)`;
      setTimeout(() => {
        document.getElementById('scissorsOpt').style.transform = translateValue;
      }, 500)

      if (RPSarr[RPSindex] == 'paper') {
        this.setState({
          NPCImgChoice: paper,
          idOfNPCOpt: "paperImg",
          showEndCard: true,
          endCardText: `You Won!!!`,
          endCardBlock: `+$5.00 gold &  10 clan points`
        })
        this.updateGold(5.00);
        this.updateClanPoints(10)
        this.updateRPSstat('scissors', 'paper', 10, 5.00);
        var translateValue2 = `translate3d(-250px,0,0)`;
        setTimeout(() => {
          document.getElementById('paperImg').style.transform = translateValue2;
          setTimeout(() => {
            document.getElementById('paperImg').style.transform = `rotate(180deg)`;
            document.getElementById('paperImg').style.transform += `translate3d(-500px,0,0)`;
          }, 500)
        }, 500)


      }
      else if (RPSarr[RPSindex] == 'rock') {
        this.setState({
          NPCImgChoice: rock,
          idOfNPCOpt: "rockImg",
          showEndCard: true,
          endCardText: `You lose!!!`,
          endCardBlock: `-$3.00 gold &  -5 clan points`
        })
        this.updateGold(-3.00);
        this.updateClanPoints(-5);
        this.updateRPSstat('scissors', 'rock', -5, -3.00);
        var translateValue2 = `translate3d(-250px,0,0)`;
        setTimeout(() => {
          document.getElementById('rockImg').style.transform = translateValue2;
          setTimeout(() => {
            document.getElementById('scissorsOpt').style.transform = `rotate(250deg)`;
            document.getElementById('scissorsOpt').style.transform += `translate3d(400px,0,0)`;
          }, 500)
        }, 500)
      }
      else if (RPSarr[RPSindex] == 'scissors') {
        this.setState({
          NPCImgChoice: scissors,
          idOfNPCOpt: "scissorsImg",
          showEndCard: true,
          endCardText: `It's a tie!!!`,
          endCardBlock: `No gold & no clan points`
        })
        var translateValue2 = `translate3d(-250px,0,0)`;
        this.updateRPSstat('scissors', 'scissors', 0, 0.00);
        setTimeout(() => {
          document.getElementById('scissorsImg').style.transform = translateValue2;
        }, 500)
      }
    }
  }


  //update gold
  updateGold(gold) {
    let bodyData = {
      "gold": gold
    }
    axios.put(`${API_URL}/api/players/updateGold/${player_id}`, bodyData)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });

  }

  //update clan points
  updateClanPoints(clanPoints) {
    let bodyData2 = {
      "clan_point": clanPoints
    }
    axios.put(`${API_URL}/api/clanDetails/updateClanPoints/${ClanID}`, bodyData2)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });

  }

  //update the stats
  updateRPSstat(player_move, com_move, clan_point_earned, gold_earned) {
    const bodyData = {
      "player_move": player_move,
      "com_move": com_move,
      "clan_point_earned": clan_point_earned,
      "gold_earned": gold_earned,
      "timestamp": new Date()
    }

    axios.post(`${API_URL}/api/rps/updateRPSstat/${ClanID}/${player_id}`, bodyData)
      .then((result) => {
        console.log(result);
        return
      })
      .catch((error) => {
        console.log(error);
        return
      })


  }




  render() {
    return (
      <div className='rockPaperScissors'>
        <div onClick={this.handleClick} style={{ backgroundImage: { Background } }} id="rockPaperScissors" >
          <div id="screen">

          </div>
          {this.state.showCountdown && (
            <p id="RPScountdown">{this.state.countdownText}</p>
          )}
          {this.state.showOptions && (
            <button className="options" id="rock">Rock</button>
          )}
          {this.state.showOptions && (
            <button className="options" id="paper">Paper</button>
          )}
          {this.state.showOptions && (
            <button className="options" id="scissors">Scissors</button>
          )}
          <div id="playerDiv">
          </div>
          {this.state.showChoice && (
            <img src={this.state.NPCImgChoice} id={this.state.idOfNPCOpt} className="resultImg" style={{ position: "absolute", width: "150px", right: "300px", top: "20px" }} />
          )}
          {this.state.showChoice && (
            <div id="playersChoice">
              <img src={this.state.playerImgChoice} id={this.state.idOfOpt} style={{ position: "absolute", width: "150px", top: "20px", left: "300px" }} className='resultImg' />
            </div>
          )}
          {this.state.showEndCard && (
            <h3 id="endCard">{this.state.endCardText}
              <span style={{ display: 'block' }}>{this.state.endCardBlock}</span>
            </h3>
          )}
          {this.state.showRestart && (
            <button id="restart" onClick={this.startGame}>Restart</button>
          )}

          <button id="backQuit">{this.state.buttonText}</button>

        </div>
      </div>

    );
  }
}

export default App;