import axios from "axios"
import { useEffect, useState } from "react"
const player_id=window.localStorage.getItem('player_id')
const API_URL = 'https://monster-cat-world.onrender.com';

export default function ShowMoney(){//This is component is for displaying player's money
    const [gold,setGold]=useState()
    useEffect(()=>{
        axios.post(API_URL+'/api/cardCollection/displayGold',{
            "playerID":player_id
        })
        .then((response)=>{
            setGold("$"+response.data[0]['gold'])
        })
    },[])
    return(
        <div style={{fontSize:'25px',color:'yellow'}}>{gold}</div>
    )
}