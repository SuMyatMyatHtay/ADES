import React from 'react';
import {
  Route,
  useParams,
  Routes,
  BrowserRouter
} from "react-router-dom";
//when you add a react page, import it here
//import *NAME* from *path* (first letter of *NAME* prefably in caps)
//then, scroll down, add a new router under <BrowserRouter>
//<Route path='/*whatever*' element={<*NAME*/>}/>
//go to localhost:3000/classExample or localhost:3000/functionExample for an example of react 
import RockPaperScissors from './screens/rockPaperScissors';
import HomePage from './screens/HomePage';
import Chat from './screens/chat.js';
import AllFriends from './screens/AllFriends';
import Trading from './screens/Trading';
import Clan from './screens/clan';

//SU's part // 
import SearchPlayer from './screens/SearchPlayer';
import FriTradeTransition from './transitions/FriTradeTransition';
import AF from './components/AF_Component';
import TradingSuccessTransition from './transitions/TradingSuccessTransition'
import FriendRequest from './screens/friendRequest'
import TradeRequest from './screens/TradeRequest'
import TradingGraph from './screens/TradingGraph'
import STpopup from './SuTestingScreens/STpopup'
import STTimeGMT from './SuTestingScreens/STTimeGMT'
import BlindTrade from './screens/BlindTrade'
import BiddingResult from './screens/BiddingResult'
import BiddingRoom from './screens/BiddingRoom'
import FirstTimeEntryB from './screens/FirstTimeEntryB'
import CollectECard from './screens/CollectECard'
import ProfileFri from './screens/ProfileFri'


//Min Rui
import ClanVillage from './screens/clanVillage';
import ClanDashboard from './screens/clanDashboard';
import CreateClan from './screens/createClan';
import Profile from './screens/profile';
import DiscoClub from './screens/discoClub';
import Hive from './screens/theHive';
import Login from './screens/login';
import SignUp from './screens/signUp'
import ForgetPassword from './screens/forgetPassword';
import HiveShop from './screens/hiveShop'
import ClanData from './screens/clanData'

//Lotus
import Clanlist from './screens/ClanList'
import PlayerPage from './screens/PlayerPage'
import LeaderBoard from './screens/leaderBoard'
import GiftCardPage from './screens/GiftCardPage'
import ClanDetailsAndMiniGames from './screens/clanDetailsAndMiniGames'
import FirstMinigame from './screens/firstMiniGame'
import SecondMinigame from './screens/secondMiniGame'
import Minigamelevels from './screens/mini_game_levels'
import Playforself from './screens/playforself'
import Playforclan from './screens/playforclanpage'
import MiniGameStatistics from "./screens/statisticsforMinigame"
import LuckyWheel from './screens/luckyWheel'
import LuckyWheelStatistics from './screens/luckywheelStatistics'

//Thiha
import CardCollection from './screens/CardCollection'
import ClanRequest from './screens/ClanRequest'
import BuyCards from './screens/BuyCards'

//Edlin
import InBetween from './screens/inBetween'
import BattlePlayer from './screens/battlePlayer'
import BattleAdversary from './screens/battleAdversary'
import BattleScene from './screens/battleScene'



class App extends React.Component {
  constructor() {

    super()
  }

  render() {
    return (
      <div >
        <BrowserRouter>
          <Routes>
          
            <Route exact path="/" element={<HomePage />} />
            <Route path="/RockPaperScissors" element={<RockPaperScissors />} />
            <Route path='/RallFriends' element={<AllFriends />} />
            <Route path='/Rtrading' element={<Trading />} />
            <Route path="/ChatMessages" element={<Chat />} />
            <Route path="/Clan" element={<Clan />} />
            <Route path='/RsearchPlayer' element={<SearchPlayer />} />
            <Route path='/RFriTradeTransition/:number' element={<FriTradeTransition />} />
            <Route path='/RTradingSuccessTransition' element={<TradingSuccessTransition />} />
            <Route path='/AF' element={<AF />} />
            <Route path='/RFriReq' element={<FriendRequest />} />
            <Route path='/RTradeReq' element={<TradeRequest />} />
            <Route path='/RTradingGraph' element={<TradingGraph />} />
            <Route path='/RBlindTrade' element={<BlindTrade />} />
            <Route path='/RBiddingResult' element={<BiddingResult />} />
            <Route path='/RBiddingRoom' element={<BiddingRoom />} />
            <Route path='/RFirstTimeEntryB' element={<FirstTimeEntryB />} />
            <Route path='/RCollectECard' element={<CollectECard />} />
            <Route path='/RProfileFri' element={<ProfileFri />} />
            <Route path='/RSTpopup' element={<STpopup />} />
            <Route path='/RSTTimeGMT' element={<STTimeGMT />} />


            <Route path='/ClanVillage' element={<ClanVillage />} />
            <Route path='/ClanDashboard' element={<ClanDashboard />} />
            <Route path='/CreateClan' element={<CreateClan />} />
            <Route path='/Profile' element={<Profile />} />
            <Route path='/DiscoCosmo' element={<DiscoClub />} />
            <Route path='/TheHive' element={<Hive />} />
            <Route path='/Login' element={<Login />} />
            <Route path='/SignUp' element={<SignUp />} />
            <Route path='/ForgetPassword' element={<ForgetPassword />} />
            <Route path='/clanlist' element={<Clanlist />} />
            <Route path='/playerPage' element={<PlayerPage />} />
            <Route path='/leaderBoardPage' element={<LeaderBoard />} />
            <Route path='/giftCardPage' element={<GiftCardPage />} />
            <Route path='/clandetailsAndMinigames' element={<ClanDetailsAndMiniGames />} />
            <Route path='/CardCollection' element={<CardCollection />} />
            <Route path='/HiveShop' element={<HiveShop/>}/>
            <Route path='/ClanData' element={<ClanData/>}/>
            <Route path='/BuyCards' element={<BuyCards />} />
            <Route path='/firstminigame/:level' element={<FirstMinigame />} />
            <Route path='/secondminigame/:level' element={<SecondMinigame />} />

            <Route path='/minigamelevel/:minigameID' element={<Minigamelevels/>}/>
            <Route path='/inBetween' element={<InBetween />} />

            <Route path='/battlePlayer' element={<BattlePlayer />} />\
            <Route path='/battleAdversary' element={<BattleAdversary />} />
            <Route path='/battleScene' element={<BattleScene />} />
            <Route path='/playforself' element={<Playforself/>}/>
            <Route path='/playforclan' element={<Playforclan/>}/>
            <Route path='/minigamestatistics' element={<MiniGameStatistics/>}/>
            <Route path='/luckywheel' element={<LuckyWheel/>}/>
            <Route path='/luckywheelstatistics' element={<LuckyWheelStatistics/>}/>

            <Route path='/clanRequest' element={<ClanRequest/>}/>


            <Route path="*" element={<HomePage />} />

          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
