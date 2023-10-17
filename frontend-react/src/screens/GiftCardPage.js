import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/giftCards.css";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "https://monster-cat-world.onrender.com";

const FreeGiftCardScreen = () => {
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const clanID = localStorage.getItem("clanIDForClanPage");
    const sorryMsg = document.getElementById("sorryMsg");
    const expireDate = document.getElementById("expireDate");

    sorryMsg.style.display = "none";
    expireDate.style.display = "none";

    if (clanID == null) {
      navigate("/clanlist");
    }

    axios
      .get(`${API_URL}/api/freeGiftCard/urlForFreeCard`)
      .then((response) => {
        console.log(response.data);
        setCards(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    axios
      .get(`${API_URL}/api/freeGiftCard/getAllDataFromCurrentMonthRank`)
      .then((response) => {
        const buttonForFirst = document.getElementById("1");
        const buttonForSecond = document.getElementById("2");
        const buttonForThird = document.getElementById("3");
        buttonForFirst.disabled = true;
        buttonForSecond.disabled = true;
        buttonForThird.disabled = true;
        if (response.data.length !== 0) {
          const parseClanID = parseInt(clanID);
          const data = response.data;
          let clanRank = null;

          for (const item of data) {
            if (item.clan_ID === parseClanID) {
              clanRank = item.clan_rank;
              expireDate.style.display = "block";
              break;
            }
          }
          if (clanRank !== null) {
            console.log(`clan is ${parseClanID} and rank is ${clanRank}`);
            if (clanRank === 1) {
              buttonForFirst.disabled = false;
              buttonForSecond.disabled = true;
              buttonForThird.disabled = true;
              buttonForFirst.style.backgroundColor = "#B84433";
              console.log(document.getElementById("1").disabled);
            } else if (clanRank === 2) {
              buttonForFirst.disabled = true;
              buttonForSecond.disabled = false;
              buttonForThird.disabled = true;
              buttonForSecond.style.backgroundColor = "#B84433";
            } else {
              buttonForFirst.disabled = true;
              buttonForSecond.disabled = true;
              buttonForThird.disabled = false;
              buttonForThird.style.backgroundColor = "#B84433";
            }
          } else {
            sorryMsg.style.display = "block";
            console.log("not found in the array.");
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [navigate]);

  const handleClick = (freeCard_ID) => {
    const x = parseInt(freeCard_ID);
    const clanID = localStorage.getItem("clanIDForClanPage");
    const buttonToclaim = document.getElementById(x);
    buttonToclaim.disabled = true;
    buttonToclaim.style.backgroundColor = "grey";
    const body = {
      clanID: clanID,
      freeCard_ID: x,
    };
    console.log(body);
    axios
      .post(`${API_URL}/api/freeGiftCard/updatePrizesHistory`, body)
      .then((response) => {
        console.log(body);
        console.log("successful");

        axios
          .delete(`${API_URL}/api/freeGiftCard/setUpClanPointsZero/${clanID}`)
          .then((response) => {
            console.log("successful");
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div id="maincontainerforgiftcard">
      <div id="containerforTitleAndButton">
        <Link to="/playforclan">
          <button id="goToClanPage">Back</button>
        </Link>
        <h1 id="titleForGiftCardPage">Prizes For Top Clans</h1>
      </div>
      <h3 id="date">DATE: First day of every month(12:00AM)</h3>
      <div id="textsForGiftCardPage">
        <div id="sorryMsg">Sorry your clan didn't get any prize</div>
        <div id="expireDate">
          *You can claim your prize until 7th of this month
        </div>
      </div>
      <div id="cardForPrize">
        {cards.map((card) => (
          <div className="column" key={card.freeCard_ID}>
            <div className="card">
              <img
                id={card.freeCard_Name}
                src={card.cardPhotoUrl}
                alt={card.freeCard_Name}
                style={{ width: "100%" }}
              />
              <button
                className="buttonToClaim"
                onClick={() => handleClick(card.freeCard_ID)}
                style={{ backgroundColor: "grey" }}
                id={card.freeCard_ID}
              >
                Claim
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FreeGiftCardScreen;
