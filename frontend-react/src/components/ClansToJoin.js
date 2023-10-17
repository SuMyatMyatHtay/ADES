import Button from './Button';
import axios from 'axios';

const API_URL = 'https://monster-cat-world.onrender.com';
const player_id = window.localStorage.getItem('player_id')

export default function ClansToJoin(props){
    function JoinClan(){
        axios.post(API_URL+'/api/clanRequest/joinClan',{
            "clan_id":props.clan.ClanID,
            "player_id":player_id
        })
        .then(()=>{
            alert('Joined clan')
        })
        .catch((error)=>{
            if(error['request'].status==404){
                alert("You cannot join more than 4 clans!!")
            }
            else if(error['request'].status==403){
                alert("You are already in the clan")
            }
            else{
                console.log(error);
            }
        })
    }
    return(
        <div id="ClanToJoin">
            <img src={require('../images/clan.png')}></img>
            <div>{props.clan.ClanName}</div>
            <div><Button text='join' onclick={JoinClan}/></div>
        </div>
    )
}