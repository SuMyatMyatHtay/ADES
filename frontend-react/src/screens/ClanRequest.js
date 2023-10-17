///////////////////////////////////////////
//IMPORTS
///////////////////////////////////////////


import { useEffect, useReducer, useState } from 'react';
import Button from '../components/Button';
import NavBar from '../components/NavBar';
import '../css/cardCollection.css'
import axios from 'axios'
import ClansToJoin from '../components/ClansToJoin';

///////////////////////////////////////////
//SETUP
///////////////////////////////////////////
const API_URL = 'https://monster-cat-world.onrender.com';
const player_id = window.localStorage.getItem('player_id')


///////////////////////////////////////////
//APP
///////////////////////////////////////////

export default function App() {

    const [clanList, setClanList] = useState()
    function SearchForClans() {


        let clanName = window.document.getElementById('searchbar').value
        console.log(clanName);
        axios.get(API_URL + '/api/clanRequest/searchClan/' + clanName)
            .then((response) => {
                setClanList(response.data.map(clan => {
                    return (
                        <ClansToJoin clan={clan} />
                    )
                }))
            })
            .catch((error) => {
                throw (error)
            })


    }
    return (
        <div id='ClanRequestMain'>
            <NavBar/>
            <div id='SearchBody'>
                <div id='search'>
                    <textarea id='searchbar'></textarea>
                    <Button onclick={SearchForClans} text="Search For Clans"/>
                </div>
                <div id='clanList'>
                    {clanList}
                </div>
            </div>
        </div>
    )
}