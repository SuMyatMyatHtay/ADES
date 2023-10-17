import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wheel } from "react-custom-roulette";
import "../css/luckyWheel.css";
import axios from "axios";

const url = "https://monster-cat-world.onrender.com";
var currentUrl = window.location.protocol + "//" + window.location.host;
if (
  window.location.hostname === "localhost" &&
  window.location.port === "3001"
) {
  currentUrl =
    window.location.protocol + "//" + window.location.hostname + ":3000";
}

const LuckyWheel = () => {
  const data = [
    {
      option: "30 clan points",
      style: { backgroundColor: "#e57373", textColor: "white" },
    },
    {
      option: "2nd prize",
      style: { backgroundColor: "#ba68c8", textColor: "white" },
    },
    {
      option: "15 clan points",
      style: { backgroundColor: "#64b5f6", textColor: "white" },
    },
    {
      option: "5 clan points",
      style: { backgroundColor: "#81c784", textColor: "white" },
    },
    {
      option: "1st prize",
      style: { backgroundColor: "#ffb74d", textColor: "white" },
    },
    {
      option: "20 clan points",
      style: { backgroundColor: "#64b5f6", textColor: "white" },
    },
    {
      option: "3rd prize",
      style: { backgroundColor: "#f06292", textColor: "white" },
    },
    {
      option: "10 clan points",
      style: { backgroundColor: "#ba68c8", textColor: "white" },
    },
    {
      option: "20 clan points",
      style: { backgroundColor: "#64b5f6", textColor: "white" },
    },
  ];

  const clanID = localStorage.getItem("clanIDForClanPage");
  const playerID = localStorage.getItem("player_id");

  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [clanName, setClanName] = useState("");
  const [clanPoints, setClanPoints] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [noOfFirstprize, setnoOfFirstprize] = useState(0);
  const [noOfSecprize, setnoOfSecprize] = useState(0);
  const [noOfTthirdprize, setnoOfTthirdprize] = useState(0);

  useEffect(() => {
    axios
      .get(`${currentUrl}/api/clanDetails/clanInformation/${clanID}`)
      .then((response) => {
        setClanName(response.data.clanName);
        setClanPoints(response.data.clanPoint);
        axios
          .get(`${currentUrl}/api/freeGiftCard/numberOfCards/${clanID}`)
          .then((numberOfCardsResponse) => {
            if (numberOfCardsResponse.data === null) {
              setnoOfFirstprize(0);
              setnoOfSecprize(0);
              setnoOfTthirdprize(0);
            } else {
              for (let i = 0; i < numberOfCardsResponse.data.length; i++) {
                if (
                  numberOfCardsResponse.data[i].freeCard_Name === "First Prize"
                ) {
                  console.log(numberOfCardsResponse.data[i].no_of_cards);
                  setnoOfFirstprize(numberOfCardsResponse.data[i].no_of_cards);
                } else if (
                  numberOfCardsResponse.data[i].freeCard_Name === "Second Prize"
                ) {
                  setnoOfSecprize(numberOfCardsResponse.data[i].no_of_cards);
                } else if (
                  numberOfCardsResponse.data[i].freeCard_Name === "Third Prize"
                ) {
                  setnoOfTthirdprize(numberOfCardsResponse.data[i].no_of_cards);
                }
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSpinClick = () => {
    if (!isSpinning) {
      const updatedClanPoints = parseInt(clanPoints) - 10;
      axios
        .put(`${currentUrl}/api/clanPoint/updateClanPoints`, {
          clanID: clanID,
          updatedClanPoints: updatedClanPoints,
        })
        .then((response) => {
          console.log("Clan points updated successfully!");
          const newPrizeNumber = Math.floor(Math.random() * data.length);
          setPrizeNumber(newPrizeNumber);
          setClanPoints(updatedClanPoints); // Update the state with the new clan points
          setMustSpin(true); // Start the spinning animation
          setIsSpinning(true); // Set the spinning state to true
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleSpinStop = () => {
    setMustSpin(false);
    setShowResult(true); // Set the state to show the result pop-up
    setIsSpinning(false);

    const prizeWon = data[prizeNumber].option;
    const isClanPointPrize = prizeWon.includes("clan points");

    if (isClanPointPrize) {
      const regex = /(\d+)/;
      const match = prizeWon.match(regex);
      if (match) {
        const pointsWon = parseInt(match[0]);
        console.log(pointsWon);
        const updatedClanPoints = parseInt(clanPoints) + pointsWon;
        const bodyDate = {
          clanID: clanID,
          updatedClanPoints: updatedClanPoints,
        };
        axios
          .put(`${currentUrl}/api/clanPoint/updateClanPoints`, bodyDate)
          .then((response) => {
            console.log("successfully updated");
            setClanPoints(updatedClanPoints);
            console.log("pointswon", pointsWon);
            const bodydataToupdateHistory = {
              playerID: playerID,
              clanID: clanID,
              pointsIncreased: pointsWon,
              firstPrize: 0,
              secondPrize: 0,
              thirdPrize: 0,
            };
            axios
              .post(
                `${currentUrl}/api/freeGiftCard/updateluckywheelStatistics`,
                bodydataToupdateHistory
              )
              .then((respose) => {
                console.log(
                  "successfully updated to the history of statistics"
                );
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        console.log("Prize format not recognized"); // Handle the case where the prize format doesn't match the expected pattern.
      }
    } else {
      console.log("prize function starting");
      let giftCardID;
      if (data[prizeNumber].option === "1st prize") {
        giftCardID = 1;
      } else if (data[prizeNumber].option === "2nd prize") {
        giftCardID = 2;
      } else if (data[prizeNumber].option === "3rd prize") {
        giftCardID = 3;
      }
      const bodyDataToUpdatePrize = {
        giftCardID: giftCardID,
        clanID: clanID,
        clanPoints: clanPoints,
      };
      console.log(bodyDataToUpdatePrize);
      axios
        .post(
          `${currentUrl}/api/freeGiftCard/updatePrizesAfterspinningWheel`,
          bodyDataToUpdatePrize
        )
        .then((response) => {
          console.log("successfully updated Prizes");
          axios
            .get(`${currentUrl}/api/freeGiftCard/numberOfCards/${clanID}`)
            .then((numberOfCardsResponse) => {
              if (numberOfCardsResponse.data === null) {
                setnoOfFirstprize(0);
                setnoOfSecprize(0);
                setnoOfTthirdprize(0);
              } else {
                for (let i = 0; i < numberOfCardsResponse.data.length; i++) {
                  if (
                    numberOfCardsResponse.data[i].freeCard_Name ===
                    "First Prize"
                  ) {
                    console.log(numberOfCardsResponse.data[i].no_of_cards);
                    setnoOfFirstprize(
                      numberOfCardsResponse.data[i].no_of_cards
                    );
                  } else if (
                    numberOfCardsResponse.data[i].freeCard_Name ===
                    "Second Prize"
                  ) {
                    setnoOfSecprize(numberOfCardsResponse.data[i].no_of_cards);
                  } else if (
                    numberOfCardsResponse.data[i].freeCard_Name ===
                    "Third Prize"
                  ) {
                    setnoOfTthirdprize(
                      numberOfCardsResponse.data[i].no_of_cards
                    );
                  }
                }
              }
              let bodydataToupdateHistory2;
              if (giftCardID === 1) {
                bodydataToupdateHistory2 = {
                  playerID: playerID,
                  clanID: clanID,
                  pointsIncreased: 0,
                  firstPrize: 1,
                  secondPrize: 0,
                  thirdPrize: 0,
                };
              } else if (giftCardID === 2) {
                bodydataToupdateHistory2 = {
                  playerID: playerID,
                  clanID: clanID,
                  pointsIncreased: 0,
                  firstPrize: 0,
                  secondPrize: 1,
                  thirdPrize: 0,
                };
              } else if (giftCardID === 3) {
                bodydataToupdateHistory2 = {
                  playerID: playerID,
                  clanID: clanID,
                  pointsIncreased: 0,
                  firstPrize: 0,
                  secondPrize: 0,
                  thirdPrize: 1,
                };
              }
              axios
                .post(
                  `${currentUrl}/api/freeGiftCard/updateluckywheelStatistics`,
                  bodydataToupdateHistory2
                )
                .then((respose) => {
                  console.log("successful");
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleResultClose = () => {
    setShowResult(false); // Close the result pop-up
  };

  const gotostatisticss = () => {
    window.location.assign(url + "/luckywheelstatistics");
  };

  const gotoplayforclanpage = () => {
    window.location.assign(url + "/playforclan");
  };

  return (
    <div id="maincontainerforluckywheel">
      <div className="lucky-wheel-container">
        {showResult && (
          <div className="result-popup-overlay">
            <div className="result-popup-content">
              <h2 style={{ color: "black" }}>Congratulations!</h2>
              <p>You won: {data[prizeNumber].option}</p>
              <button onClick={handleResultClose}>Close</button>
            </div>
          </div>
        )}
        <div>
          <div id="containerFortwoButtonsandclanname">
            <div>
              <button id="backButtonInwheel" onClick={gotoplayforclanpage}>
                Back
              </button>
            </div>
            <div>
              <p id="textsInLuckyWheel">Clan Name : {clanName}</p>
              <div
                style={{
                  display: "flex",
                  marginBottom: "10%",
                  gap: "50px",
                  marginLeft: "7%",
                }}
              >
                <div id="clanPointsdisplay">Clan Points : {clanPoints}</div>
                <div className="prizesinwheel">
                  <i
                    className="fa fa-trophy"
                    id="firsttrophyIcons"
                    aria-hidden="true"
                  ></i>
                  {noOfFirstprize}
                </div>
                <div className="prizesinwheel">
                  <i
                    className="fa fa-trophy"
                    id="secondtrophyIcons"
                    aria-hidden="true"
                  ></i>
                  {noOfSecprize}
                </div>
                <div className="prizesinwheel">
                  <i
                    className="fa fa-trophy"
                    id="thirdtrophyIcons"
                    aria-hidden="true"
                  ></i>
                  {noOfTthirdprize}
                </div>
              </div>
            </div>
            <div>
              <button id="statButtonInwheel" onClick={gotostatisticss}>
                Statistics
              </button>
            </div>
          </div>
        </div>
        <div id="containerForWheelAndInstruction">
          <div style={{ marginRight: "5%" }}>
            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={prizeNumber}
              data={data}
              onStopSpinning={handleSpinStop} // Callback when spinning animation is finished
              outerBorderColor="#4E5452"
              outerBorderWidth={3}
              innerBorderColor="#4E5452"
              innerBorderWidth={3}
              radiusLineColor="#4E5452"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="spin-button"
              onClick={handleSpinClick}
              disabled={isSpinning}
            >
              Spin( use 10 points)
            </motion.button>
          </div>
          <div id="containerforInstructionInLuckyWheel">
            <p
              style={{
                marginTop: "13%",
                fontSize: "20px",
                fontStyle: "italic",
                fontWeight: "bold",
              }}
            >
             Don't forget to try your luck and win amazing prizes(or not) once in a while.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuckyWheel;
